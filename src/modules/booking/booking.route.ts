import express from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router = express.Router();

router.post("/", auth(Roles.admin, Roles.user), bookingController.createBooking);

router.get("/",auth(Roles.admin, Roles.user), bookingController.getBookings);

router.put("/:id", auth(Roles.admin, Roles.user), bookingController.updateStatus);

export const bookingRouter = router;