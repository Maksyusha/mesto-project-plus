import { Router } from "express";
import { createUser, getUserById, getAllUsers, updateAvatar, updateProfile } from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.patch('/me', updateProfile)
router.patch('/me/avatar', updateAvatar)

export default router;
