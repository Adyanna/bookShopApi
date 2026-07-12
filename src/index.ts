import app from './app';
import { environmentService } from './infraestructure/global/EnvironmentService';
import { sellBookEmailWorker } from './ui/book/workers/sellBookEmail';
import cron from 'node-cron';
import { suggestPriceReductionTask } from './ui/book/tasks/priceReductionSuggestionTask';
import { suggestPriceReductionWorker } from './ui/book/workers/suggestPriceReduction';

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

sellBookEmailWorker();
suggestPriceReductionWorker();

cron.schedule('0 7 * * 1', async () => {
  console.log('PRICE REDUCTION CRON');
  await suggestPriceReductionTask();
});
