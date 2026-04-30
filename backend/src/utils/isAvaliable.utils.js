import Booking from "../models/Booking.model.js";

export const isAvailable = async (listingId, checkInDate, checkOutDate) => {
    const bookings = await Booking.find({
        listing: listingId,
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate }
    });
    return bookings.length === 0;
};
