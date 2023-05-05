import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import { TErrors } from '../utils/errors/classes';
import {
  BAD_REQUEST_MESSAGE,
  INVALID_ID_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from '../utils/errors/error-messages';

const handleErrors = (
  err: Error | TErrors | mongoose.Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction, // TODO: otherwise the app will crash
) => {
  let { statusCode = 500, message = SERVER_ERROR_MESSAGE } = err as TErrors;

  // Решил сделать немного по-другому
  switch (err.constructor) {
    case mongoose.Error.ValidationError:
      statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      message = BAD_REQUEST_MESSAGE;
      break;
    case mongoose.Error.CastError:
      statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      message = INVALID_ID_MESSAGE;
      break;
    default:
      break;
    // Не сделал проверку на DocumentNotFoundError,
    // потому что вместо orFail используется проверка через if,
    // по которой не было замечаний, напишите, если стоит переписать
  }

  res.status(statusCode).send({ message });
};

export default handleErrors;
