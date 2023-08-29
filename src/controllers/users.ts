import { Response, Request, NextFunction } from "express";
import User from "../models/user";
import NotFoundError from "../types/errors/classes/not-found-error";
import { USER_NOT_FOUND } from "../types/errors/error-messages";

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  User.create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findByIdAndUpdate((req as any).user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findByIdAndUpdate((req as any).user._id, req.body, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(200).send(user);
    })
    .catch(next);
};
