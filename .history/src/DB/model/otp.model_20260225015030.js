
import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // ينتهي بعد 5 دقائق
});

export const  OTPModel = mongoose.model.Otp ||  mongoose.model('Otp', otpSchema);
