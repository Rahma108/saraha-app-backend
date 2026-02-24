

    // "nodemailer": "^8.0.1",
    // "otp-generator": "^4.0.1"

// توليد OTP عشوائي 6 أرقام
import { transporter } from '../../common/utils/security/otp.security.js';
import { OTPModel } from '../../DB/index.js';

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtpFunction = async ({ email }) => {

    if (!email) {
        throw new Error("Email is required");
    }

    // امسح أي OTP قديم لنفس الايميل
    await OTPModel.deleteMany({ email });

    const code = generateOtp();

    // خزنه في DB
    await OTPModel.create({ email, code });

    // ابعت ايميل
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

    // احذفه بعد الاستخدام
    await OTPModel.deleteOne({ _id: otpRecord._id });

    return { success: true, message: "OTP verified successfully" };
};


// // التحقق من OTP
// export async function verifyOtp(email, code) {
//     const otpRecord = await OTPModel.findOne({ email, code });
//     if (!otpRecord) return false;

//     await OTPModel.deleteOne({ _id: otpRecord._id });
//     return true;
>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
// }