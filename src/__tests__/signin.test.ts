import app from '../app';
import request from 'supertest';
import { prismaClient } from '../infraestructure/global/PrismaClient';
import { createUserTest, TEST_USER } from './testUtils/Auth';
import { environmentService } from '../infraestructure/global/EnvironmentService';

describe('POST /authentication/signin', () => {
  beforeAll(async () => {
    await environmentService.loadEnv();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  const endpoint = '/authentication/signin';

  test('should return an access token when credentials are valid', async () => {
    await createUserTest();

    const response = await request(app).post(endpoint).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeDefined();
  });

  test('should return not found error when user does not exist', async () => {
    const response = await request(app).post(endpoint).send({
      email: 'unknown.user@bookshop.com',
      password: 'Password123*',
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test('should return unauthorized error when password is incorrect', async () => {
    //await createUserTest();

    const response = await request(app).post(endpoint).send({
      email: TEST_USER.email,
      password: 'WrongPassword123*',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when email is not provided', async () => {
    const response = await request(app).post(endpoint).send({
      password: 'Password123*',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when password is not provided', async () => {
    const response = await request(app).post(endpoint).send({
      email: TEST_USER.email,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
