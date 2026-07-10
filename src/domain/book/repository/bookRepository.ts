import { Book } from '../Book';
import { PublishBookUseCaseInput } from '../BookUseCases/PublishUseCase';
import { UpdateBookUseCaseInput } from '../BookUseCases/UpdateUseCase';
// import { BuyBookUseCaseInput } from '../BookUseCases/BuyUseCase';
// import { RemoveProdUseCaseInput } from '../use-cases/remove-product';
// //import { Pagination } from '../../global/Pagination';
// import { findProductUseCaseInput } from '../use-cases/find-product';

export interface BookRepository {
  create: (params: PublishBookUseCaseInput) => Promise<Book>;
  update: (id: number, params: UpdateBookUseCaseInput) => Promise<Book>;
  findById(id: number): Promise<Book | null>;
  remove: (id: number) => Promise<void>;
  buy: (id: number) => Promise<void>;
  //   findById: (id: number) => Promise<Product | null>;
  //   isProductAvailable: (id: number) => Promise<boolean>;
  //   findMany: (params: findProductUseCaseInput) => Promise<{ product: Product[]; total: number }>;
}
