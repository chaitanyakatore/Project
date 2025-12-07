import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../db/index.js', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
  },
}));

const { createUser, getUserByEmail } = await import('../../services/user.service.js');
const { db } = await import('../../db/index.js');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '1', email: 'test@example.com', firstname: 'Test', lastname: 'User' };
      db.where.mockResolvedValue([mockUser]);

      const result = await getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if not found', async () => {
      db.where.mockResolvedValue([]);

      const result = await getUserByEmail('notfound@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const mockUser = {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        salt: 'salt',
        password: 'hashedpassword',
      };
      const mockCreatedUser = { id: '1' };
      
      db.returning.mockResolvedValue([mockCreatedUser]);

      const result = await createUser(mockUser);

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(expect.objectContaining({
        email: mockUser.email,
        password: mockUser.password,
      }));
      expect(result).toEqual(mockCreatedUser);
    });
  });
});
