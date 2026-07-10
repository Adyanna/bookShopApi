import { NextFunction, Request, Response } from 'express';
import { UpdateBookUseCase } from '../../../domain/book/BookUseCases/UpdateUseCase';
import { BookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { z } from 'zod';

const updateBookSchema = z.object({
  title: z.string().min(5, { message: 'El titulo es obligatorio' }),
  description: z.string().min(1, { message: 'La descripción es obligatoria' }),
  price: z.number().positive({ message: 'El precio debe ser un número positivo' }),
  author: z.string().min(5, { message: 'El autor es obligatorio' }),
});

export const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, price, author } = updateBookSchema.parse(req.body);
    const bookPrismaRepository = new BookPrismaRepository();
    const updateBookUseCase = new UpdateBookUseCase(bookPrismaRepository);

    const id = Number(req.params.id);
    const newbook = await updateBookUseCase.executeUpdateBook(id, {
      title,
      description,
      price,
      author,
      ownerId: Number(req.userId),
    });
    res.status(200).json(newbook);
  } catch (error: unknown) {
    next(error);
  }
};
