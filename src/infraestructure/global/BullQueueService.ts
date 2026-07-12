import { QueueService } from '../../domain/global/QueueService';
import { Queue } from 'bullmq';
import { environmentService } from './EnvironmentService';

export class BullQueueService implements QueueService {
  private readonly sellBookEmailQueue: Queue;
  private readonly suggestPriceReductionEmailQueue: Queue;

  constructor() {
    const { REDIS_HOST, REDIS_PORT } = environmentService.get();
    const conection = {
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    };

    this.sellBookEmailQueue = new Queue('sell-book-email', conection);
    this.suggestPriceReductionEmailQueue = new Queue('suggest-price-reduction', conection);
  }
  async sendEmailSuggestPriceReduction(params: {
    email: string;
    firstName: string;
    booktitle: string;
  }) {
    await this.suggestPriceReductionEmailQueue.add('Suggest-Price-Reduction', params);
  }

  async sendEmailSellBook(params: { onwerId: number; booktitle: string }) {
    await this.sellBookEmailQueue.add('sell-book-email-job', params);
  }
}
