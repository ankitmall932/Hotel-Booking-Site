import express from "express";
import * as controllers from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import reviewSchema from "../validation/review.validator.js";
import { validateSchema } from "../middleware/schema.validate.js";

const router = express.Router();

router.post("/:listingId", protect, validateSchema(reviewSchema), controllers.createReview);

router.get("/user-reviews", protect, controllers.getReviewsByUser);

router.get("/:listingId", controllers.getReviewsByListing);

router.delete("/:reviewId", protect, controllers.deleteReview);

export default router;