import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

class AuthService {
  // Short-lived Access Token (15 minutes)
  generateAccessToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '15m',
    });
  }

  // Long-lived Refresh Token (7 days)
  generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
      expiresIn: '7d',
    });
  }

  async registerUser({ name, email, password, role }) {
    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await UserRepository.create({ name, email, password, role });
    if (!user) {
      throw new Error('Invalid user data');
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Save refresh token to user in DB
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async loginUser({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Save refresh token to user in DB
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
      const user = await UserRepository.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user._id);
      const newRefreshToken = this.generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      throw new Error('Unauthorized: Refresh token expired or invalid');
    }
  }

  async logoutUser(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
      const user = await UserRepository.findById(decoded.id);
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
      return { message: 'Logged out successfully' };
    } catch (err) {
      // Even if token verification fails, return success or just clear DB if user found
      return { message: 'Logged out' };
    }
  }
}

export default new AuthService();
