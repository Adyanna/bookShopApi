import { NextFunction, Request, Response } from 'express';
import { BookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { BookCatalogUseCase } from '../../../domain/book/BookUseCases/CatalogUseCase';
import z from 'zod';
import { PaginatedResponse } from '../../global/types/PaginationResponse';
import { Book } from '../../../domain/book/Book';

const findProductQueryParamsValidator = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().min(3).optional(),
});

export const findBookController = async (req: Request, res: Response, next: NextFunction) => {
  const bookprismaProduct = new BookPrismaRepository();
  const findBook = new BookCatalogUseCase(bookprismaProduct);

  try {
    const { page, limit, search } = findProductQueryParamsValidator.parse(req.query);
    const { books, total } = await findBook.executeCatalogo({ page, limit, search });
    const responde: PaginatedResponse<Book> = {
      data: books,
      meta: {
        limit,
        page,
        total,
      },
    };
    res.status(200).json(responde);
  } catch (error) {
    next(error);
  }
};
