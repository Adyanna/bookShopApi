import { NextFunction, Request, Response } from 'express';
import { BookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { MyBooksCatalogUseCase } from '../../../domain/book/BookUseCases/CatalogUseCase';

export const findMyBookController = async (req: Request, res: Response, next: NextFunction) => {
  const bookprismaProduct = new BookPrismaRepository();
  const findBook = new MyBooksCatalogUseCase(bookprismaProduct);

  try {
    const ownerId = Number(req.userId);
    const book = await findBook.executeCatalogoMe(ownerId);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
