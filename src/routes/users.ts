import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUserById,
  getAllUsers,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  getUserByIdJoi,
  updateAvatarJoi,
  updateProfileJoi,
} from '../utils/validation';

const router = Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate(getUserByIdJoi), getUserById);
router.patch('/me', celebrate(updateProfileJoi), updateProfile);
router.patch('/me/avatar', celebrate(updateAvatarJoi), updateAvatar);

export default router;
