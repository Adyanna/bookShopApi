export interface QueueService {
  sendEmailSellBook: (params: { onwerId: number; booktitle: string }) => void;
  sendEmailSuggestPriceReduction: (params: {
    email: string;
    firstName: string;
    booktitle: string;
  }) => void;
}
