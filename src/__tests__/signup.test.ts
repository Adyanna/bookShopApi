import request from 'supertest';
import app from '../app';
import { prismaClient } from '../infraestructure/global/PrismaClient';
import { environmentService } from '../infraestructure/global/EnvironmentService';

describe('POST /authentication/signup', () => {
  beforeAll(async () => {
    await environmentService.loadEnv();
    await prismaClient.user.deleteMany();
  });
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  const userEmail = `email.fake.${Date.now()}@example.com`;
  const endpoint = '/authentication/signup';

  test('should create a new user when valid information is provided', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Adriana',
      lastName: 'Cutipa',
      email: userEmail,
      password: 'Secure123*',
    });

    expect(response.status).toBe(201);

    const createdUser = await prismaClient.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    expect(createdUser).not.toBeNull();
  });

  test('should return validation error when password does not meet requirements', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Maria',
      lastName: 'Lopez',
      email: 'weak.password@test.com',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when email format is invalid', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Carlos',
      lastName: 'Rojas',
      email: 'invalid-email',
      password: 'Password123*',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toEqual('The email provided is incorrect');
  });

  test('should return validation error when first name is missing', async () => {
    const response = await request(app).post(endpoint).send({
      lastName: 'Perez',
      email: 'firstname@test.com',
      password: 'Password123*',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when last name is missing', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Laura',
      email: 'lastname@test.com',
      password: 'Password123*',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when email is missing', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Pedro',
      lastName: 'Gomez',
      password: 'Password123*',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should return validation error when password is missing', async () => {
    const response = await request(app).post(endpoint).send({
      firstName: 'Sofia',
      lastName: 'Mendez',
      email: 'nopassword@test.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toEqual('Los campos son obligatorios');
  });

  test('should return conflict error when email is already registered', async () => {
    await request(app).post(endpoint).send({
      firstName: 'Existing',
      lastName: 'User',
      email: userEmail,
      password: 'Secure123*',
    });

    const response = await request(app).post(endpoint).send({
      firstName: 'Another',
      lastName: 'User',
      email: userEmail,
      password: 'Secure123*',
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBeDefined();
  });
});
