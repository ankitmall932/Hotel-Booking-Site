import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ "customer", "owner" ],
        default: "customer"
    },
    currentRole: {
        type: String,
        enum: [
            'customer', 'owner'
        ],
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpired: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);


