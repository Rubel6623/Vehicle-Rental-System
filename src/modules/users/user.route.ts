import express from 'express';
import { userControllers } from './user.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router = express.Router();

router.post("/", userControllers.createUser);
router.get("/", auth(), userControllers.getUser);
router.get("/:id", auth("admin"), userControllers.getSingleUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", auth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;