import winston from 'winston';
import ExpressWinston from 'express-winston';

export const requestLogger = ExpressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

export const errorLogger = ExpressWinston.logger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});
