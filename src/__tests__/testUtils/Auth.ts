import request from 'supertest';
import app from '../../app';

export const TEST_USER = {
  email: 'pruebaUsuerio@prueba.com',
  password: '123Albena*__',
};

export const TEST_USER_BUY = {
  email: 'pruebaUserBuy@prueba.com',
  password: '123Albena*__',
};

const url = '/authentication';

export async function createUserTest(
  overrides: { email?: string; password?: string; lastName?: string; firstName?: string } = {},
) {
  const resp = await request(app)
    .post(url + '/signup')
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
  return resp.body;
}

export async function singinUserTest(overrides: { email?: string; password?: string } = {}) {
  const resp = await request(app)
    .post(url + '/signin')
    .send({
      email: TEST_USER.email,
      password: TEST_USER.password,
      ...overrides,
    });
  if (resp.status !== 200) {
    throw new Error(`Error logging in user: ${resp.status} - ${resp.body}`);
  }
  return resp.body.token;
}
