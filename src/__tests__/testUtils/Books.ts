import request from 'supertest';
import app from '../../app';

const url = '/books';

export async function createBookTest(
  token: string,
  overrides: { title?: string; description?: string; price?: number; author?: string } = {},
) {
  const resp = await request(app)
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Libro publicado',
      description: 'Libro disponible para compra',
      price: 50,
      author: 'Autor',
      ...overrides,
    });
  if (resp.status !== 201) {
    throw new Error(`Error creating BOOK: ${resp.status} - ${resp.body}`);
  }
  return resp.body;
}

export async function buyBookTest(token: string, id: number) {
  const resp = await request(app).post(`/books/${id}/buy`).set('Authorization', `Bearer ${token}`);
  if (resp.status !== 200) {
    throw new Error(`Error buying BOOK: ${resp.status} - ${resp.body}`);
  }
  return resp.body;
}
