import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    amenities: [ String ],
    images: [
        {
            url: String,
            public_id: String
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        city: String,
        state: String,
        country: {
            type: String,
            default: 'India'
        }
    },
});

export default mongoose.model.Listing || mongoose.model('Listing', listingSchema);