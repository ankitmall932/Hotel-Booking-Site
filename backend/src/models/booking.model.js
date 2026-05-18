import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [ 'Pending', 'Confirmed', 'Cancelled', 'Completed', 'Expired' ],
        default: 'Pending'
    },
    razorpay_payment_id: {
        type: String
    },
    expiresAt: {
        type: Date,
        required: function () {
            return this.paymentStatus === 'pending';
        }
    },
    paymentMethod: {
        type: String,
        enum: [ 'Razorpay', 'Pay_on_Property' ],
        default: null
    }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);