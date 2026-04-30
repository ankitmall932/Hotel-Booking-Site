import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp, name) => {
    try
    {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for TodoApp Email Verification',
            html: `<h1>Hello ${ name } </h1>
            <h1>This is your register/reset otp</h1>
            <h2>${ otp }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};