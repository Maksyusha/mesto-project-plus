import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../utils/errors/classes/authentication-error';
import { INVALID_TOKEN_MESSAGE } from '../utils/errors/error-messages';

const handleAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError(INVALID_TOKEN_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    const { TOKEN_SECRET_KEY = 'secret-key' } = process.env;
    payload = jwt.verify(token, TOKEN_SECRET_KEY);
  } catch {
    throw new AuthenticationError(INVALID_TOKEN_MESSAGE);
  }

  (req as any).user = payload;

  next();
};

export default handleAuth;
