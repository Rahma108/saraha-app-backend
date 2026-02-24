<<<<<<< HEAD
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
        rejectUnauthorized: false // للتجاوز أثناء التطوير فقط
    }
});

// optional: تحقق قبل الإرسال
transporter.verify()
  .then(() => console.log("Mail server is ready"))
  .catch(err => console.error("Mail server error:", err));

=======
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
        rejectUnauthorized: false // للتجاوز أثناء التطوير فقط
    }
});

// optional: تحقق قبل الإرسال
transporter.verify()
  .then(() => console.log("Mail server is ready"))
  .catch(err => console.error("Mail server error:", err));

>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
