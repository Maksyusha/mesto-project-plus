import { Response, Request, NextFunction } from 'express';
import { constants } from 'http2';
import User from '../models/user';
import NotFoundError from '../types/errors/classes/not-found-error';
import { USER_NOT_FOUND } from '../types/errors/error-messages';

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(constants.HTTP_STATUS_CREATED).send(user);
    })
    .catch(next);
};

// долго думал как сделать через декоратор, но к сожалению не догнал ;(
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate((req as any).user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = { name: req.body.name, about: req.body.about };

  updateUser(req, res, next);
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = { avatar: req.body.avatar };

  updateUser(req, res, next);
};
