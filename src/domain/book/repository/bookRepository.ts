import { Book } from '../Book';
import { PublishBookUseCaseInput } from '../BookUseCases/PublishUseCase';
import { UpdateBookUseCaseInput } from '../BookUseCases/UpdateUseCase';
import { findBooksUseCaseInput } from '../BookUseCases/CatalogUseCase';
import { PriceSuggestionBook } from '../BookUseCases/PriceReductionSuggestion';

export interface BookRepository {
  create: (params: PublishBookUseCaseInput) => Promise<Book>;
  update: (id: number, params: UpdateBookUseCaseInput) => Promise<Book>;
  findById(id: number): Promise<Book | null>;
  remove: (id: number) => Promise<void>;
  buy: (id: number) => Promise<void>;
  findByOwnerId: (id: number) => Promise<Book[]>;
  findPublished: (params: findBooksUseCaseInput) => Promise<{ books: Book[]; total: number }>;
  findBooksForPriceSuggestion(): Promise<PriceSuggestionBook[]>;
}
