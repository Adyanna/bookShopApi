import request from 'supertest';
import app from '../../app';

export const TEST_USER = {
  email: 'pruebaUsuerio@prueba.com',
  password: '123Albena*__',
};

const url = '/authentication/signup';

export async function createUserTest(
  overrides: { email?: string; password?: string; lastName?: string; firstName?: string } = {},
) {
  const resp = await request(app)
    .post(url)
    .send({
      firstName: 'test usuario',
      lastName: 'apellido',
      email: TEST_USER.email,
      password: TEST_USER.password,
      ...overrides,
    });
  if (resp.status !== 201) {
    throw new Error(`Error creating user: ${resp.status} - ${resp.body}`);
  }
  console.log('USUARIO CREADO: ', resp.body);
}

export async function singinUserTest(overrides: { email?: string; password?: string } = {}) {
  const resp = await request(app)
    .post(url)
    .send({
      email: TEST_USER.email,
      password: TEST_USER.password,
      ...overrides,
    });
  console.log('USUARIO LOGEADO: ', resp.body);
  if (resp.status !== 200) {
    throw new Error(`Error logging in user: ${resp.status} - ${resp.body}`);
  }
  return resp.body.token;
}
