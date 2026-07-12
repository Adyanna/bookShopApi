import { Job, Worker } from 'bullmq';
import { signupPrismaRepository } from '../../../infraestructure/authentication/signupPrismaRepository';
import { nodeEmailService } from '../../../infraestructure/global/nodeEmailServide';

export const suggestPriceReductionWorker = () => {
  new Worker(
    'suggest-price-reduction',
    async (job: Job<{ email: string; firstName: string; booktitle: string }>) => {
      console.log('SELL BOOOK WORKER');
      console.log(job.data);
      const emailService = new nodeEmailService();
      const message = `
            Hello ${job.data.firstName},

            Your book "${job.data.booktitle}" has been published for more than 7 days.

            We recommend reviewing or reducing its price to increase the chances of selling it.

            Regards,
            Bookshop
        `;
      console.log('ENVIO DE MENSAJE: ', message);
      emailService.send({
        email: String(job.data.email),
        message: message,
        subjectText: 'Price reduction suggestion',
      });
    },
    {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    },
  );
};
