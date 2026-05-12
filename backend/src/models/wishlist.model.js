import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
}, { timestamps: true });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);