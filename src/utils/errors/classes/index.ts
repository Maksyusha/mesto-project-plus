import AuthenticationError from './authentication-error';
import BadRequestError from './bad-request-error';
import ConflictError from './conflct-error';
import ForbiddenError from './forbidden-error';
import NotFoundError from './not-found-error';

export type TErrors =
  | NotFoundError
  | BadRequestError
  | AuthenticationError
  | ForbiddenError
  | ConflictError;
