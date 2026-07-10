import { NextFunction, Request, Response } from 'express';
import { DeleteBookUseCase } from '../../../domain/book/BookUseCases/DeleteUseCase';
import { PublishBookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { z } from 'zod';

export const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookPrismaRepository = new PublishBookPrismaRepository();
    const deleteBookUseCase = new DeleteBookUseCase(bookPrismaRepository);
    await deleteBookUseCase.executeUpdateBook({
      id: Number(req.params.id),
      ownerId: Number(req.userId),
    });
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
