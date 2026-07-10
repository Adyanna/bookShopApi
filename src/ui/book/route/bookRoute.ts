import { Router } from 'express';
import { publishBookController } from '../controllers/publishController';
import { authenticationMiddleware } from '../../authentication/middlewares/authMiddleware';
import { updateBookController } from '../controllers/updateController';
import { deleteBookController } from '../controllers/deleteController';
import { buyBookController } from '../controllers/buyController';
import { findBookController } from '../controllers/catalogoController';

export const bookRoute = Router();

//crear uevo libro
bookRoute.post('/', authenticationMiddleware, publishBookController);

//ediatr libro
bookRoute.put('/:id', authenticationMiddleware, updateBookController);

bookRoute.delete('/:id', authenticationMiddleware, deleteBookController);

bookRoute.post('/:id/buy', authenticationMiddleware, buyBookController);

bookRoute.get('/', findBookController);
