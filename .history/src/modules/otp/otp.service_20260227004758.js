
import { compareHash, generateHash } from '../../common/utils/security/index.js';
import { transporter } from '../../common/utils/security/otp.security.js';
import { OTPModel } from '../../DB/index.js';

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtpFunction = async ({ email }) => {

    if (!email) {
        throw new Error("Email is required");
    }
    await OTPModel.deleteMany({ email });

    const code = generateOtp();

    const hashOTP = await generateHash(code)

    await OTPModel.create({
        email,
        code: hashOTP,
        expiresAt
    });

    await sendOTP(email, code);

    return { message: "OTP sent successfully" };
};

export const verifyOtp = async ({ email, code }) => {

    if (!email || !code) {
        throw new Error("Email and code are required");
    }

    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
        return { success: false, message: "Invalid or expired OTP" };
    }
    const isMatch = await compareHash(code, otpRecord.code);

    if (!isMatch) {
        return { success: false, message: "Invalid OTP" };
    }

    await OTPModel.deleteOne({ _id: otpRecord._id });

    return { success: true, message: "OTP verified successfully" };
};
