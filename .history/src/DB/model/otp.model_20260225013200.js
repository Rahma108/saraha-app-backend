<<<<<<< HEAD
import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // ينتهي بعد 5 دقائق
});

export const  OTPModel = mongoose.model.Otp ||  mongoose.model('Otp', otpSchema);



=======
import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // ينتهي بعد 5 دقائق
});

export const  OTPModel = mongoose.model.Otp ||  mongoose.model('Otp', otpSchema);



>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
