import express from 'express';
import { erroHandlerMiddleware } from './ui/global/middleware/ErrorHandlerMiddleware';
import { authRoute } from './ui/authentication/route/authRoute';

const app = express();

app.use(express.json());
app.use('/authentication', authRoute);

app.use(erroHandlerMiddleware);
export default app;
