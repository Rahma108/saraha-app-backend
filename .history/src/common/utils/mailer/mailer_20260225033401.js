
import nodemailer from 'nodemailer'


export const transporter = nodemailer.createTransport(
    {
        service :"gmail" , 
        auth :{
            user : GMAIL ,
            pass : PASSWORD
        }
    }
)


export const sendOTP = async (email , otp)=>{
    try {
        const info = await transporter.sendMail({
            from : GMAIL , 
            to : email ,
            subject : "YOUR OTP CODE",
            text :`Your OTP code is ${otp}`
        })
        console.log("Email sent :" , info.response);
        return true
        
    } catch (error) {
        
        
    }


}