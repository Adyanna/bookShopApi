import { Router } from 'express';
import { signupAuthController } from '../controllers/signupController';
import { signinController } from '../controllers/signinController';

export const authRoute = Router();

//registro
authRoute.post('/signup', signupAuthController);
//inicio de sesion
authRoute.post('/signin', signinController);
