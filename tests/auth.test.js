import request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  app,
  connectToDatabase,
  disconnectDatabase,
  startServer,
  stopServer,
} from '../server.js';

let testUser;

beforeAll(async () => {
  await connectToDatabase();
  startServer();

  testUser = {
    email: faker.internet.email(),
    password: faker.internet.password(10),
    roles: ['user'],
  };
});

afterAll(async () => {
  stopServer();
  await disconnectDatabase();
});

describe('Auth API Endpoints', () => {
  it('should return a validation error when email or password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: '', password: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual([
      'Please provide a valid email',
      'Password must be at least 5 characters long',
    ]);
  });

  it('should sign up a new user successfully', async () => {
    const response = await request(app).post('/api/auth/signup').send(testUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('roles');
    expect(response.body.roles).toContain('ROLE_USER');
  });

  it('should sign in a user successfully', async () => {
    // Sign up the user first
    await request(app).post('/api/auth/signup').send(testUser);

    const response = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error for incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid Password!');
  });
});
