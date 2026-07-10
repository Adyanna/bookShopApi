import { Router } from 'express';
import { authenticationMiddleware } from '../../authentication/middlewares/authMiddleware';
import { findMyBookController } from '../controllers/catalogoController';

export const meRoute = Router();

meRoute.get('/books', [authenticationMiddleware, findMyBookController]);
