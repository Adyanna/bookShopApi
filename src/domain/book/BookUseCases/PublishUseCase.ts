import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { ValidationError } from '../../errors/ValidationError';
import { SegurityServices } from '../../global/SegurityService';
import { BookRepository } from '../repository/bookRepository';

import { Book, BookStatus } from '../Book';

export interface PublishBookUseCaseInput {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: number;
  status?: BookStatus;
}

export class PublishBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async executePublishBook(props: PublishBookUseCaseInput): Promise<Book> {
    //reglas de negocio
    if (props.price <= 0) {
      throw new ValidationError('The price must be greater than zero');
    }
    const book = await this.bookRepository.create(props);
    return book;
  }
}
