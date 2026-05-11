import Booking from "../models/booking.model.js";

export const isAvailable = async (listingId, checkInDate, checkOutDate) => {
    const bookings = await Booking.find({
        listing: listingId,
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
        status: { $in: [ 'Pending', 'Confirmed' ] } // Only consider active bookings
    });
    return bookings.length === 0;
};
