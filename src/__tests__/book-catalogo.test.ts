import request from 'supertest';
import app from '../app';
import { prismaClient } from '../infraestructure/global/PrismaClient';
import { createUserTest, singinUserTest, TEST_USER_BUY } from './testUtils/Auth';
import { createBookTest, buyBookTest } from './testUtils/Books';
import { environmentService } from '../infraestructure/global/EnvironmentService';

describe('GET /books', () => {
  let token: string;

  beforeAll(async () => {
    await environmentService.loadEnv();

    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();

    await createUserTest();
    const token = await singinUserTest();

    await createBookTest(token, {
      title: 'Clean Code',
      author: 'Robert Martin',
      price: 45,
    });

    await createBookTest(token, {
      title: 'Refactoring',
      author: 'Martin Fowler',
      price: 60,
    });

    await createBookTest(token, {
      title: 'Domain Driven Design',
      author: 'Eric Evans',
      price: 70,
    });

    await createBookTest(token, {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      price: 50,
    });

    await createBookTest(token, {
      title: 'JavaScript The Good Parts',
      author: 'Douglas Crockford',
      price: 35,
    });

    await createUserTest({ email: TEST_USER_BUY.email });
    const tokenBuy = await singinUserTest({ email: TEST_USER_BUY.email });
    // vender un libro para verificar que no aparezca
    const refactoring = await prismaClient.book.findFirst({
      where: {
        title: 'Refactoring',
      },
    });

    await buyBookTest(tokenBuy, Number(refactoring?.id));
  });

  afterAll(async () => {
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('Paginación', () => {
    it('should return paginated books', async () => {
      const response = await request(app).get('/books?page=1&limit=2');

      expect(response.status).toBe(200);
      console.log('LIBRO A VENDER:', response.body);
      expect(response.body.data.length).toBe(2);
      expect(response.body.meta.total).toBe(4);
    });
  });

  describe('Search by title', () => {
    it('should return books matching title', async () => {
      const response = await request(app).get('/books?search=clean');

      expect(response.status).toBe(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Clean Code');
    });
  });

  describe('Search by author', () => {
    it('should return books matching author', async () => {
      const response = await request(app).get('/books?search=evans');

      expect(response.status).toBe(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].author).toBe('Eric Evans');
    });
  });

  describe('Sold books exclusion', () => {
    it('should not return sold books', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(200);

      const soldBook = response.body.data.find((book: any) => book.title === 'Refactoring');

      expect(soldBook).toBeUndefined();

      expect(response.body.meta.total).toBe(4);
    });
  });
});
