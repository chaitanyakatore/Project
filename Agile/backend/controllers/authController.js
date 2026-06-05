import AuthService from '../services/AuthService.js';

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await AuthService.registerUser({ name, email, password, role });
    
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const parseCookie = (cookieHeader, name) => {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = parseCookie(req.headers.cookie, 'refreshToken') || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ accessToken: result.accessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = parseCookie(req.headers.cookie, 'refreshToken') || req.body?.refreshToken;
    if (refreshToken) {
      await AuthService.logoutUser(refreshToken);
    }
    
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
