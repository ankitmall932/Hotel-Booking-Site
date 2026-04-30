import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshToken: String,
    revoked: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Session', sessionSchema);
