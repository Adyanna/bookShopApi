import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { ValidationError } from '../../errors/ValidationError';
import { BookRepository } from '../repository/bookRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { BookStatus } from '../Book';
import { QueueService } from '../../global/QueueService';

export interface BuyBookUseCaseInput {
  buyerId: number;
}

export class BuyBookUseCase {
  private readonly bookRepository: BookRepository;
  private readonly bookQueue: QueueService;

  constructor(bookRepository: BookRepository, bookQueue: QueueService) {
    this.bookRepository = bookRepository;
    this.bookQueue = bookQueue;
  }

  async executeBuyBook(id: number, props: BuyBookUseCaseInput): Promise<void> {
    //reglas de negocio
    if (isNaN(id)) {
      throw new ValidationError('Book id must be a number');
    }
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new EntityNotFoundError('Book', String(id));
    }

    if (book.ownerId === props.buyerId) {
      throw new BusinessConflictError('You cannot buy your own book');
    }

    if (book.status === BookStatus.SOLD) {
      throw new BusinessConflictError('Book already sold');
    }

    // const buybook =
    await this.bookRepository.buy(id);
    this.bookQueue.sendEmailSellBook({ onwerId: book.ownerId, booktitle: book.title });
  }
}
