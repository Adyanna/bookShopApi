import app from './app';
import { environmentService } from './infraestructure/global/EnvironmentService';

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
