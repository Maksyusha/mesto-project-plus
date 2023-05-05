import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createCard,
  deleteCardById,
  getAllCards,
  likeCard,
  unLikeCard,
} from '../controllers/cards';
import {
  createCardJoi,
  deleteCardJoi,
  likeCardJoi,
  unlikeCardJoi,
} from '../utils/validation';

const router = Router();

router.get('/', getAllCards);
router.post('/', celebrate(createCardJoi), createCard);
router.delete('/:cardId', celebrate(deleteCardJoi), deleteCardById);
router.put('/:cardId/likes', celebrate(likeCardJoi), likeCard);
router.delete('/:cardId/likes', celebrate(unlikeCardJoi), unLikeCard);

export default router;
