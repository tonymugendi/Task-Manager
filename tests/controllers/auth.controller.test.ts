import request from 'supertest';
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import authRoutes from '../../src/routes/auth.routes';
import { globalErrorHandler } from '../../src/middleware/error.middleware';
import { cleanDatabase, testPrisma, testDataFactory } from '../utils/testUtils';

describe('Auth Controller', () => {
  let app: any;

  beforeAll(async () => {
    // Create Fastify instance for testing
    app = Fastify({ logger: false });
    
    // Register CORS
    await app.register(FastifyCors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    });

    // Register auth routes
    await app.register(authRoutes, { prefix: '/auth' });
    
    // Set error handler
    app.setErrorHandler(globalErrorHandler);

    // Ready the app
    await app.ready();
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
  });

  afterAll(async () => {
    // Clean up after all tests
    await cleanDatabase();
    await testPrisma.$disconnect();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = testDataFactory.user();

      const response = await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should fail to register with invalid email', async () => {
      const userData = testDataFactory.user({ email: 'invalid-email' });

      const response = await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Invalid email format'
          })
        ])
      );
    });

    it('should fail to register with weak password', async () => {
      const userData = testDataFactory.user({ password: '123' });

      const response = await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('Password must be at least 6 characters')
          })
        ])
      );
    });

    it('should fail to register with password missing requirements', async () => {
      const userData = testDataFactory.user({ password: 'password' }); // Missing uppercase and number

      const response = await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('Password must contain at least one lowercase letter, one uppercase letter, and one number')
          })
        ])
      );
    });

    it('should fail to register with duplicate email', async () => {
      const userData = testDataFactory.user();

      // First registration should succeed
      await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(200);

      // Second registration with same email should fail
      const response = await request(app.server)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('ConflictError');
      expect(response.body.message).toBe('Email already in use');
    });

    it('should fail to register with missing required fields', async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('Required')
          }),
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('Required')
          })
        ])
      );
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = testDataFactory.user();
      await request(app.server)
        .post('/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123'
      };

      const response = await request(app.server)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should fail to login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123'
      };

      const response = await request(app.server)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('UnauthorizedError');
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail to login with invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'WrongPassword123'
      };

      const response = await request(app.server)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('UnauthorizedError');
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail to login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'Password123'
      };

      const response = await request(app.server)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Invalid email format'
          })
        ])
      );
    });

    it('should fail to login with missing credentials', async () => {
      const response = await request(app.server)
        .post('/auth/login')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('Required')
          }),
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('Required')
          })
        ])
      );
    });
  });
});
