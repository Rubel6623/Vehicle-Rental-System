import express from 'express';
import { userControllers } from './user.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router = express.Router();

// router.post("/", userControllers.createUser);

router.get("/", auth(Roles.admin), userControllers.getUser);

router.get("/:id", auth(Roles.admin), userControllers.getSingleUser);

router.put("/:id",auth(Roles.admin, Roles.user), userControllers.updateUser);

router.delete("/:id", auth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;