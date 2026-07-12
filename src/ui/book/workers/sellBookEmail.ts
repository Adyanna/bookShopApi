import { Job, Worker } from 'bullmq';
import { signupPrismaRepository } from '../../../infraestructure/authentication/signupPrismaRepository';
import { nodeEmailService } from '../../../infraestructure/global/nodeEmailServide';

export const sellBookEmailWorker = () => {
  new Worker(
    'sell-book-email',
    async (job: Job<{ ownerId: number; booktitle: string }>) => {
      console.log('SELL BOOOK WORKER');
      console.log(job.data);
      const userRespository = new signupPrismaRepository();
      const user = await userRespository.findOneUser({ id: Number(job.data.ownerId) });
      const emailService = new nodeEmailService();
      const message = `Buenas ${user?.firstName}, Informarle que el libro con el titulo: "${job.data.booktitle}". a sido vendido!`;
      console.log('ENVIO DE MENSAJE: ', message);
      emailService.send({
        email: String(user?.email),
        message: message,
        subjectText: 'Venta de tu libro!',
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
