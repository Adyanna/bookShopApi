import request from 'supertest';
import app from '../app';
import { prismaClient } from '../infraestructure/global/PrismaClient';
import { createUserTest, TEST_USER, TEST_USER_BUY, singinUserTest } from './testUtils/Auth';
import { environmentService } from '../infraestructure/global/EnvironmentService';
import { createBookTest } from './testUtils/Books';

describe('POST /books/:id/buy', () => {
  let buyerToken: string;
  let buyerId: number;
  let sellerId: number;
  let sellerToken: string;

  let publishedBookId: number;
  let ownBookId: number;

  beforeAll(async () => {
    await environmentService.loadEnv();

    // Usuario comprador
    await createUserTest();
    const buyerSignin = await singinUserTest();
    console.log('TOKEN COMPRADO:', buyerSignin);
    buyerToken = buyerSignin;
    const buyer = await prismaClient.user.findUnique({ where: { email: TEST_USER.email } });
    buyerId = buyer!.id;

    // Crear usuario vendedor
    await createUserTest({
      email: TEST_USER_BUY.email,
      password: TEST_USER_BUY.password,
      lastName: 'Prueba',
      firstName: 'Usuario Buy',
    });
    const sellerSignin = await singinUserTest({
      email: TEST_USER_BUY.email,
      password: TEST_USER_BUY.password,
    });
    sellerToken = sellerSignin;
    const seller = await prismaClient.user.findUnique({ where: { email: TEST_USER_BUY.email } });
    sellerId = seller!.id;

    // Libro que puede comprar el buyer
    const publishedBook = await createBookTest(sellerToken);
    publishedBookId = publishedBook.id;

    // Libro propio del comprador
    const ownBook = await createBookTest(sellerToken, {
      title: 'Mi propio libro',
      description: 'No puedo comprarlo',
      price: 30,
      author: 'Autor',
    });
    ownBookId = ownBook.id;
  });

  afterAll(async () => {
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('Compra correcta', () => {
    it('should buy a book correctly', async () => {
      const response = await request(app)
        .post(`/books/${publishedBookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);

      const book = await prismaClient.book.findUnique({ where: { id: publishedBookId } });

      expect(book?.status).toBe('SOLD');

      expect(book?.soldAt).not.toBeNull();
    });
  });

  describe('Libro inexistente', () => {
    it('should fail if book does not exist', async () => {
      const response = await request(app)
        .post('/books/99999/buy')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Book with id 99999 not found');
    });
  });

  describe('Libro vendido', () => {
    it('should fail if book is already sold', async () => {
      // Segunda compra
      const response = await request(app)
        .post(`/books/${publishedBookId}/buy`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(409);
      expect(response.body.error).toEqual('Book already sold');
    });
  });

  describe('Compra propia', () => {
    it('should fail if user buys his own book', async () => {
      const response = await request(app)
        .post(`/books/${ownBookId}/buy`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(response.status).toBe(409);
      expect(response.body.error).toEqual('You cannot buy your own book');
    });
  });

  describe('Sin autenticación', () => {
    it('should fail without authentication', async () => {
      const response = await request(app).post(`/books/${publishedBookId}/buy`);
      expect(response.status).toBe(401);
      expect(response.body.error).toEqual('No token provided');
    });
  });
});
