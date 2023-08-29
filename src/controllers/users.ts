import { Response, Request, NextFunction } from 'express';
import { constants } from 'http2';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../utils/errors/classes/not-found-error';
import {
  CONFLICT_EMAIL_MESSAGE,
  USER_NOT_FOUND,
} from '../utils/errors/error-messages';
import ConflictError from '../utils/errors/classes/conflct-error';
import { TOKEN_SECRET_KEY } from '../../app.config';

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
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      User.create({
        password: hash,
        email,
        name,
        about,
        avatar,
      })
        .then((user) => {
          const userWithoutPassword = user.toObject();
          // @ts-ignore
          delete userWithoutPassword.password; // TODO: because the password field is required
          res.status(constants.HTTP_STATUS_CREATED).send(userWithoutPassword);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(CONFLICT_EMAIL_MESSAGE));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, TOKEN_SECRET_KEY, {
        expiresIn: '7d',
      });

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById((req as any).user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};
