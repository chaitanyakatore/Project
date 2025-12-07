import request from 'supertest';
import app from '../../index.js';

describe('User E2E', () => {
  const testEmail = `e2e-${Date.now()}@example.com`;
  const testUser = {
    firstname: 'E2E',
    lastname: 'User',
    email: testEmail,
    password: 'password123',
  };

  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('userId');
  });

  it('should fail to create a user with existing email', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send(testUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail with invalid data', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({ ...testUser, email: 'invalid-email' });

    expect(response.status).toBe(400);
  });
});
