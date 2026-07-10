import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ValidationError } from '../../errors/ValidationError';
import { BookRepository } from '../repository/bookRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

import { Book, BookStatus } from '../Book';

export interface UpdateBookUseCaseInput {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: number;
}

export class UpdateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async executeUpdateBook(id: number, props: UpdateBookUseCaseInput): Promise<Book> {
    //reglas de negocio
    if (isNaN(id)) {
      throw new ValidationError('Book id must be a number');
    }
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new EntityNotFoundError('Book', String(id));
    }

    if (book.ownerId !== props.ownerId) {
      throw new UnauthorizedError('You dont have permission to update this book');
    }

    if (props.price <= 0) {
      throw new ValidationError('The price must be greater than zero');
    }
    const Updatebook = await this.bookRepository.update(id, props);
    return Updatebook;
  }
}
