import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import Bookings from '../models/booking.model.js';
import { isAvailable } from '../utils/isAvaliable.utils.js';
import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

export const getProfile = async (req, res) => {
    try
    {
        const user = await User.findById(req.user._id).select('-password');
        if (!user)
        {
            return res.status(404).json({
                message: 'User Not found'
            });
        }
        return res.status(200).json(user);
    } catch (err)
    {
        return res.status(500).json({
            message: err.message
        });
    }
};
//basically this part is belong to customer.controller.js 
export const getListingsByState = async (req, res) => {
    try
    {
        const { state } = req.params;
        const listings = await Listing.find({ 'location.state': state });
        return res.status(200).json({
            message: 'Listings found',
            listings
        });
    } catch (err)
    {
        return res.status(500).json({
            message: err.message
        });
    }
};

export const getDetailListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.findById(req.params.id).populate('owner');
        if (!listing)
        {
            return res.status(404).json({
                message: 'Listing not found or access denied'
            });
        }
        return res.status(200).json({
            message: 'This is your listing',
            listing: listing
        });
    } catch (err)
    {
        next(err);
    }
};

export const createBooking = async (req, res, next) => {
    try
    {
        const { listingId, checkInDate, checkOutDate } = req.body;
        const available = await isAvailable(
            listingId,
            new Date(checkInDate),
            new Date(checkOutDate)
        );
        const readableCheckInDate = new Date(checkInDate).toLocaleDateString();
        const readableCheckOutDate = new Date(checkOutDate).toLocaleDateString();
        if (!available)
        {
            return res.status(400).json({
                message: `Room is already booked from ${ readableCheckInDate } to ${ readableCheckOutDate }`
            });
        }
        const listing = await Listing.findById(listingId);
        if (!listing)
        {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }
        const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        const booking = await Bookings.create({
            user: req.user._id,
            listing: listingId,
            checkInDate,
            checkOutDate,
            owner: listing.owner,
            status: 'Pending',
            totalPrice: nights * listing.price
        });
        return res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (err)
    {
        next(err);
    }
};

export const getUserBookings = async (req, res, next) => {
    try
    {
        const bookings = await Bookings.find({ user: req.user._id }).populate('listing');
        return res.status(200).json({
            message: 'Bookings retrieved successfully',
            bookings
        });
    } catch (err)
    {
        next(err);
    }
};

export const deleteBooking = async (req, res, next) => {
    try
    {
        await Bookings.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Booking deleted successfully'
        });
    } catch (err)
    {
        next(err);
    }
};

export const createPaymentOrder = async (req, res, next) => {
    try
    {
        const bookingId = req.params.id;
        const booking = await Bookings.findById(bookingId).populate('listing');
        if (!booking)
        {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }
        const options = {
            amount: Math.round(booking.totalPrice * 100), // amount in paise
            currency: 'INR',
            receipt: booking._id.toString(),
            payment_capture: 1
        };
        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({
            message: 'Payment order created successfully',
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err)
    {
        next(err);
    }
};

export const verifyPayment = async (req, res, next) => {
    try
    {
        const bookingId = req.params.id;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        {
            return res.status(400).json({
                message: 'Missing payment verification data',
                success: false
            });
        }
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        if (expectedSignature === razorpay_signature)
        {
            await Bookings.findByIdAndUpdate(bookingId, { status: 'Confirmed', razorpay_payment_id });
            return res.status(200).json({
                message: 'Payment verified successfully',
                success: true
            });
        } else
        {
            return res.status(400).json({
                message: 'Invalid signature',
                success: false
            });
        }
    } catch (err)
    {
        next(err);
    }
};

export const cancelBooking = async (req, res, next) => {
    try
    {
        const bookingId = req.params.id;
        const booking = await Bookings.findById(bookingId);
        if (!booking)
        {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }
        if (booking.status !== 'Confirmed')
        {
            return res.status(400).json({
                message: 'Only confirmed bookings can be cancelled'
            });
        };
        if (booking.user.toString() !== req.user._id.toString())
        {
            return res.status(403).json({
                message: 'Unauthorized to cancel this booking'
            });
        }
        let refund = null;
        if (booking.razorpay_payment_id)
        {
            const refundAmount = Math.floor(booking.totalPrice * 0.8 * 100); // 80% refund in paise
            refund = await razorpayInstance.payments.refund(booking.razorpay_payment_id, {
                amount: refundAmount,
            });
        }
        booking.status = 'Cancelled';
        await booking.save();
        return res.status(200).json({
            message: 'Booking cancelled successfully' + (refund ? ' and refund initiated' : ''),
            refund
        });
    } catch (err)
    {
        next(err);
    }
};