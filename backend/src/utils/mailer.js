import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    user: process.env.BREVO_SMTP_USERNAME,
    pass: process.env.BREVO_SMTP_PASSWORD
});
export const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USERNAME,
        pass: process.env.BREVO_SMTP_PASSWORD
    }
});
