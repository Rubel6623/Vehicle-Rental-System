import express from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router = express.Router();

router.post("/",auth(Roles.admin, Roles.user), bookingController.createBooking);

router.get("/", bookingController.getBookings);

export const bookingRouter = router;