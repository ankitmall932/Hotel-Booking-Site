import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    browser: String,
    os: String,
    device: String,
    ip: String,
    token: String,
    lastActive: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
}
);

export default mongoose.model.Device || mongoose.model('Device', deviceSchema);