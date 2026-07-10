import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ValidationError } from '../../errors/ValidationError';
import { BookRepository } from '../repository/bookRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

import { Book, BookStatus } from '../Book';

export interface DeleteBookUseCaseInput {
  id: number;
  ownerId: number;
}

export class DeleteBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async executeUpdateBook({ id, ownerId }: DeleteBookUseCaseInput): Promise<void> {
    //reglas de negocio
    if (isNaN(id)) {
      throw new ValidationError('Book id must be a number');
    }
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new EntityNotFoundError('Book', String(id));
    }

    if (book.ownerId !== ownerId) {
      throw new UnauthorizedError('You dont have permission to delete this book');
    }

    const Updatebook = await this.bookRepository.remove(id);
  }
}
