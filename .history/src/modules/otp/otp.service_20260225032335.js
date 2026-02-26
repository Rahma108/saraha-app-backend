
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

    await OTPModel.create({ email, code });
        await transporter.sendMail({
        from: `"My App" <${process.env.MAIL_USER}>`, 
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${code}`,
        });
    return { message: "OTP sent successfully" };
};

export const verifyOtp = async ({ email, code }) => {

    if (!email || !code) {
        throw new Error("Email and code are required");
    }

    const otpRecord = await OTPModel.findOne({ email, code });

    if (!otpRecord) {
        return { success: false, message: "Invalid or expired OTP" };
    }

    await OTPModel.deleteOne({ _id: otpRecord._id });

    return { success: true, message: "OTP verified successfully" };
};
