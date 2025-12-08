import express from 'express';
import { bookingController } from './booking.controller';

const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookings);

export const bookingRouter = router;