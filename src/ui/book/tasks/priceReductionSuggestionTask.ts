import { SuggestPriceReductionUseCase } from '../../../domain/book/BookUseCases/PriceReductionSuggestion';
import { BookPrismaRepository } from '../../../infraestructure/book/bookPrismaRepository';
import { BullQueueService } from '../../../infraestructure/global/BullQueueService';

export const suggestPriceReductionTask = async () => {
  const bookrepo = new BookPrismaRepository();
  const QueueService = new BullQueueService();
  const priceReductionScheduler = new SuggestPriceReductionUseCase(bookrepo, QueueService);

  await priceReductionScheduler.execute();
};
