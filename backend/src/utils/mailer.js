import 'dotenv/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USERNAME,
        pass: process.env.BREVO_SMTP_PASSWORD
    }
});
