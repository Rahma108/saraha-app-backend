
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


export const send