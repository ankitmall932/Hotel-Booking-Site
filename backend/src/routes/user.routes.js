import express from 'express';
import * as controller from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, controller.getProfile);

router.get('/listings/state/:state', controller.getListingsByState);

router.get('/listing/:id', controller.getDetailListing);

router.get('/bookings', protect, controller.getUserBookings);

router.post('/bookings', protect, controller.createBooking);

router.delete('/bookings/:id', protect, controller.deleteBooking);

router.post('/bookings/:id/create-order', protect, controller.createPaymentOrder);

router.post('/bookings/:id/verify', protect, controller.verifyPayment);

router.put('/bookings/:id/cancel', protect, controller.cancelBooking);

export default router;