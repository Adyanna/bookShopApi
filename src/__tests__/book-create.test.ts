import request from 'supertest';
import app from '../app';
import { prismaClient } from '../infraestructure/global/PrismaClient';
import { createUserTest, TEST_USER, singinUserTest } from './testUtils/Auth';
import { environmentService } from '../infraestructure/global/EnvironmentService';

describe('Books API', () => {
  let token: string;
  let bookId: number;

  beforeAll(async () => {
    await environmentService.loadEnv();
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();

    // Crear usuario
    const signupResponse = await createUserTest();
    // Login para obtener token
    const signinResponse = await singinUserTest();
    token = signinResponse;
  });

  afterAll(async () => {
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('POST /books', () => {
    it('should create a book correctly', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Clean Code',
          description: 'Libro de buenas practicas',
          price: 45.9,
          author: 'Robert Martin',
        });

      console.log('LIBRO CREADO: ', response.body);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Clean Code');
      expect(response.body.status).toBe('PUBLISHED');
      bookId = response.body.id;
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/books').send({
        title: 'Clean Code',
        description: 'Libro',
        price: 20,
        author: 'Robert Martin',
      });

      expect(response.status).toBe(401);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: '',
          price: -10,
          author: '',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book correctly', async () => {
      const response = await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Clean Code Updated',
          price: 50,
          description: 'Libro de buenas practicas',
          author: 'Robert Martin',
        });

      expect(response.status).toBe(200);

      expect(response.body.title).toBe('Clean Code Updated');
    });

    it('should fail if book does not exist', async () => {
      const response = await request(app)
        .put('/books/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'No existe',
        });

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).put(`/books/${bookId}`).send({
        title: 'Cambio',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book correctly', async () => {
      const response = await request(app)
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should fail deleting a non existing book', async () => {
      const response = await request(app)
        .delete('/books/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).delete('/books/1');

      expect(response.status).toBe(401);
    });
  });
});
