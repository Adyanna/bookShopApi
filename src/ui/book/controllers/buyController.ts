import { NextFunction, Request, Response } from 'express';
import { BuyBookUseCase } from '../../../domain/book/BookUseCases/BuyUseCase';
import { PublishBookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookPrismaRepository = new PublishBookPrismaRepository();
    const updateBookUseCase = new BuyBookUseCase(bookPrismaRepository);

    const id = Number(req.params.id);
    const newbook = await updateBookUseCase.executeBuyBook(id, { buyerId: Number(req.userId) });
    res.status(200).json(newbook);
  } catch (error: unknown) {
    next(error);
  }
};
