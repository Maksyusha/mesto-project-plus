import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index';
import handleErrors from './middlewares/handleErrors';
import NotFoundError from './types/errors/classes/not-found-error';
import { NOT_FOUND_MESSAGE } from './types/errors/error-messages';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  (req as any).user = {
    _id: '6447b54e3153a828191dae01',
  };

  next();
});
app.use('/', routes);
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(NOT_FOUND_MESSAGE));
});
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
