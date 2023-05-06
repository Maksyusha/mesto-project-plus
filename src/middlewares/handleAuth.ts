import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../utils/errors/classes/authentication-error';
import { INVALID_TOKEN_MESSAGE } from '../utils/errors/error-messages';
import { TOKEN_SECRET_KEY } from '../../app.config';

const handleAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthenticationError(INVALID_TOKEN_MESSAGE));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, TOKEN_SECRET_KEY);
  } catch {
    return next(new AuthenticationError(INVALID_TOKEN_MESSAGE));
  }

  (req as any).user = payload;

  return next();
};

export default handleAuth;
