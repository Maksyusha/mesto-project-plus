import { Response, Request, NextFunction } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import NotFoundError from '../utils/errors/classes/not-found-error';
import {
  CARD_NOT_FOUND,
  FORBIDDEN_DELETE_CARD_MESSAGE,
} from '../utils/errors/error-messages';
import ForbiddenError from '../utils/errors/classes/forbidden-error';

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  Card.create({ ...req.body, owner: (req as any).user._id })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(CARD_NOT_FOUND);
      }
      if (card.owner.toString() === (req as any).user._id) {
        throw new ForbiddenError(FORBIDDEN_DELETE_CARD_MESSAGE);
      }
      res.status(200).send({ message: 'Пост удалён' });
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: (req as any).user._id },
    },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError(CARD_NOT_FOUND))
    .then((card) => {
      res.status(constants.HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};

export const unLikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: (req as any).user._id },
    },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError(CARD_NOT_FOUND);
      }
      res.status(constants.HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};
