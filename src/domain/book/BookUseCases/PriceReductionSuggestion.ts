import { BookRepository } from '../repository/bookRepository';
import { emailService } from '../../global/emailService';
import { QueueService } from '../../global/QueueService';

export interface PriceSuggestionBook {
  title: string;
  firstName: string;
  email: string;
}

export class SuggestPriceReductionUseCase {
  private readonly bookRepository: BookRepository;
  private readonly bookQueue: QueueService;

  constructor(bookRepository: BookRepository, QueueService: QueueService) {
    this.bookRepository = bookRepository;
    this.bookQueue = QueueService;
  }

  async execute(): Promise<void> {
    const books = await this.bookRepository.findBooksForPriceSuggestion();

    for (const book of books) {
      this.bookQueue.sendEmailSuggestPriceReduction({
        email: book.email,
        firstName: book.firstName,
        booktitle: book.title,
      });
    }
  }
}
