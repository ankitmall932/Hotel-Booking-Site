import cron from 'node-cron';
import Booking from '../models/booking.model.js';

cron.schedule('* * * * *', async () => {
    await Booking.deleteMany({
        status: 'Pending',
        expiresAt: { $lte: new Date() }
    });
});