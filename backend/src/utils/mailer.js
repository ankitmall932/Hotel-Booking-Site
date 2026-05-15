import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    user: process.env.BREVO_SMTP_USERNAME,
    pass: process.env.BREVO_SMTP_PASSWORD,
    email: process.env.MAIL_FROM
});
export const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USERNAME,
        pass: process.env.BREVO_SMTP_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

await transporter.verify();
console.log("SMTP connected successfully");