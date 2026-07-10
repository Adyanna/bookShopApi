import { NextFunction, Request, Response } from 'express';
import { PublishBookUseCase } from '../../../domain/book/BookUseCases/PublishUseCase';
import { PublishBookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { SegurityService } from '../../../infraestructure/global/SegurityService';
import { z } from 'zod';

const publichBookSchema = z.object({
  title: z.string().min(5, { message: 'El titulo es obligatorio' }),
  description: z.string().min(10, { message: 'La descripción es obligatoria' }),
  price: z.number().positive({ message: 'El precio debe ser un número positivo' }),
  author: z.string().min(5, { message: 'El autor es obligatorio' }),
});

export const publishBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, price, author } = publichBookSchema.parse(req.body);
    const bookPrismaRepository = new PublishBookPrismaRepository();
    const createBookUseCase = new PublishBookUseCase(bookPrismaRepository);

    const newbook = await createBookUseCase.executePublishBook({
      title,
      description,
      price,
      author,
      ownerId: req.userId!,
    });
    res.status(201).json(newbook);
  } catch (error: unknown) {
    next(error);
  }
};
