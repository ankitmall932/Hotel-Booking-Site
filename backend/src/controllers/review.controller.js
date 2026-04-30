import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";

//Professional review controller
/* export const createReview = async (req, res, next) => {
    try
    {
        const { bookingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;
        const booking = await Booking.findById(bookingId);
        if (!booking)
        {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.user.toString() !== userId)
        {
            return res.status(403).json({ message: "You can only review your own bookings" });
        }
        if (new Date() < new Date(booking.checkOutDate))
        {
            return res.status(400).json({ message: "You can only review after checkout" });
        }
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview)
        {
            return res.status(400).json({ message: "You have already reviewed this booking" });
        }
        const review = await Review.create({
            user: userId,
            listing: booking.listing,
            booking: bookingId,
            rating,
            comment
        });
        res.status(201).json({ message: "Review created successfully", review });
    } catch (error)
    {
        next(error);
    }
}; */

export const createReview = async (req, res, next) => {
    try
    {
        const { listingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;
        const listing = await Listing.findById(listingId);
        if (!listing)
        {
            return res.status(404).json({ message: "Listing not found" });
        }
        const alreadyReviewed = await Review.findOne({ user: userId, listing: listingId });
        if (alreadyReviewed)
        {
            return res.status(400).json({ message: "You have already reviewed this listing" });
        }
        const review = await Review.create({
            user: userId,
            listing: listingId,
            rating,
            comment
        });
        res.status(201).json({ message: "Review created successfully", review });
    } catch (error)
    {
        next(error);
    }
};

export const getReviewsByListing = async (req, res, next) => {
    try
    {
        const { listingId } = req.params;
        const reviews = await Review.find({ listing: listingId }).populate("user");
        res.status(200).json({ reviews });
    } catch (error)
    {
        next(error);
    }
};

export const getReviewsByUser = async (req, res, next) => {
    try
    {
        const userId = req.user._id;
        const reviews = await Review.find({ user: userId }).populate("user").populate("listing");
        if (!reviews || reviews.length === 0)
        {
            return res.status(404).json({ message: "No reviews found for this user" });
        }
        res.status(200).json({
            message: "Your Reviews",
            review: reviews
        });
    } catch (error)
    {
        next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    try
    {
        const { reviewId } = req.params;
        const userId = req.user._id;
        const review = await Review.findById(reviewId);
        if (!review)
        {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.user.toString() !== userId.toString())
        {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }
        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error)
    {
        next(error);
    }
};
