
import nodemailer from 'nodemailer'
import { EMAIL  , } from '../../../../config/config.service.js'

export const transporter = nodemailer.createTransport(
    {
        service :"gmail" , 
        auth :{
            user : EMAIL,
            pass : PASSWORD
        }
    }
)


export const sendOTP = async (email , otp)=>{
    try {
        const info = await transporter.sendMail({
            from : GMAIL, 
            to : email ,
            subject : "YOUR OTP CODE",
            text :`Your OTP code is ${otp}`
        })
        console.log("Email sent :" , info.response);
        return true
        
    } catch (error) {
        console.log("Email error :" , error );
        throw new Error("Failed to send OTP email")
    }
}