import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  getAllCards,
  likeCard,
  unLikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unLikeCard);

export default router;
