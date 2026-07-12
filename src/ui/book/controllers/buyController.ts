import { NextFunction, Request, Response } from 'express';
import { BuyBookUseCase } from '../../../domain/book/BookUseCases/BuyUseCase';
import { BookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { BullQueueService } from '../../../infraestructure/global/BullQueueService';

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookPrismaRepository = new BookPrismaRepository();
    const queueService = new BullQueueService();
    const updateBookUseCase = new BuyBookUseCase(bookPrismaRepository, queueService);

    const id = Number(req.params.id);
    const newbook = await updateBookUseCase.executeBuyBook(id, { buyerId: Number(req.userId) });
    res.status(200).json(newbook);
  } catch (error: unknown) {
    next(error);
  }
};
