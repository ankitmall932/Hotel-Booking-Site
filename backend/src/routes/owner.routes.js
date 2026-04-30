import express from 'express';
import upload from '../middleware/multer.js';
import * as ownerController from '../controllers/owner.controller.js';
import { listingSchema } from '../validation/listing.validator.js';
import { validateSchema } from '../middleware/schema.validate.js';
import { protect } from '../middleware/auth.middleware.js';
import { isOwner } from '../middleware/isOwner.middleware.js';

const router = express.Router();

router.post('/create',
    protect,
    isOwner,
    upload.array('images', 5),
    validateSchema(listingSchema),
    ownerController.createListing
);

router.get('/country-data', ownerController.countryData);

router.get('/user-listings', protect, isOwner, ownerController.getUserListing);

router.get('/listing/:id', protect, isOwner, ownerController.detailListing);

router.get('/image/:id', ownerController.imagePreview); //common in user\\customer also

router.put('/listing/update/:id',
    protect,
    isOwner,
    upload.array('images', 5),
    ownerController.updateListing
);

router.delete('/listing/delete/:id', protect, isOwner, ownerController.deleteListing);

router.get('/bookings', protect, isOwner, ownerController.getOwnerBookings);

export default router;