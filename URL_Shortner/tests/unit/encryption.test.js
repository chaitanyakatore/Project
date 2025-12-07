import generatedHashedPassword from '../../utils/encryption.js';

describe('Encryption Utils', () => {
  it('should generate a salt and hashed password', () => {
    const password = 'password123';
    const result = generatedHashedPassword(password);

    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('password');
    expect(result.salt).toBeDefined();
    expect(result.password).toBeDefined();
    expect(result.password).not.toBe(password);
  });

  it('should generate different salts for the same password', () => {
    const password = 'password123';
    const result1 = generatedHashedPassword(password);
    const result2 = generatedHashedPassword(password);

    expect(result1.salt).not.toBe(result2.salt);
    expect(result1.password).not.toBe(result2.password);
  });
});
