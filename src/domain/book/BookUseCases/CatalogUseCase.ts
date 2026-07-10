import { Book } from '../Book';
import { BookRepository } from '../repository/bookRepository';
import { Pagination } from '../../global/Pagination';
import { ValidationError } from '../../errors/ValidationError';

export interface findBooksUseCaseInput extends Pagination {
  search?: string;
}

export class BookCatalogUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async executeCatalogo(params: findBooksUseCaseInput): Promise<{ books: Book[]; total: number }> {
    const { books, total } = await this.bookRepository.findPublished(params);
    return { books, total };
  }
}

export class MyBooksCatalogUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async executeCatalogoMe(ownerId: number): Promise<Book[]> {
    if (isNaN(ownerId)) {
      throw new ValidationError('Owner id must be a number');
    }

    return await this.bookRepository.findByOwnerId(ownerId);
  }
}
