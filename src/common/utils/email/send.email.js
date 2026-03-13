import nodemailer from "nodemailer";
import { APPLICATION_NAME, GMAIL, PASSWORD } from "../../../../config/config.service.js";

export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = []
    } = {}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: GMAIL,
        pass: PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
        from: `"${APPLICATION_NAME}💌" <${GMAIL}>`,
        to,
        cc,
        bcc,
        subject,
        html,
        attachments,
        });

        console.log("Message sent:", info.messageId);
        return info; 
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error; 
    }
};