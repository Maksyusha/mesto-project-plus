import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { TErrors } from "../types/errors/classes";
import { ErrorNames } from '../types/errors/error-names'
import { BAD_REQUEST_MESSAGE, SERVER_ERROR_MESSAGE } from "../types/errors/error-messages";

const handleErrors = (
  err: Error | TErrors | mongoose.Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = err as TErrors;

  if (err instanceof mongoose.Error) {
    switch (err.name) {
      case ErrorNames.ValidationError:
      case ErrorNames.CastError: {
        statusCode = 400
        message = BAD_REQUEST_MESSAGE
      }
    }
  }

  if (err.name === ErrorNames.Error && statusCode === 500) {
    message = SERVER_ERROR_MESSAGE;
  }

  res.status(statusCode).send({ message });
};

export default handleErrors;
