
          // Nodemailer .... transporter


import nodemailer from "nodemailer";

    export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,      // مثال: sandbox.smtp.mailtrap.io
    port: Number(process.env.MAIL_PORT) || 2525, // لازم يتحول Number
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false 
    }
});

transporter.verify()
  .then(() => console.log("Mail server is ready"))
  .catch(err => console.error("Mail server error:", err));

