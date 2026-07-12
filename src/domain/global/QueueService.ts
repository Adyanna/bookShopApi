export interface QueueService {
  sendEmailSellBook: (params: { onwerId: number; booktitle: string }) => void;
}
