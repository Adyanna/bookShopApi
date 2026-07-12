import app from './app';
import { environmentService } from './infraestructure/global/EnvironmentService';
import { sellBookEmailWorker } from './ui/book/workers/sellBookEmail';
import cron from 'node-cron';

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

sellBookEmailWorker();
