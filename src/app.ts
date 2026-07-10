import express from 'express';
import { erroHandlerMiddleware } from './ui/global/middleware/ErrorHandlerMiddleware';
import { authRoute } from './ui/authentication/route/authRoute';
import { bookRoute } from './ui/book/route/bookRoute';
import { meRoute } from './ui/me/route/meRoute';

const app = express();

app.use(express.json());
app.use('/authentication', authRoute);
app.use('/books', bookRoute);
app.use('/me', meRoute);

app.use(erroHandlerMiddleware);
export default app;
