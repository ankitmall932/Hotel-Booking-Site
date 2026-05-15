import nodemailer from 'nodemailer';
import { transporter } from './mailer.js';

export const registerEmail = async (email, otp, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'Your OTP for Siddhi Hotels Email Verification',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>This is your Account Register otp on Siddhi Hotels</h1>
            <h2>${ otp }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const registeredEmail = async (email, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'You are successfully registered on Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>Congratulations! You have successfully registered on Siddhi Hotels.</h1>
            <p>We are thrilled to have you as a part of our community. Now you can explore our wide range of hotels and make your bookings with ease.</p>
            <p>Thank you for choosing Siddhi Hotels. We look forward to providing you with an exceptional experience!</p>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const loginEmail = async (email, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'You have successfully logged in to Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>You have successfully logged in to Siddhi Hotels</h1>
            <p>Welcome back! We're glad to see you again.</p>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const createPaymentEmail = async (email, bookingId, name, totalPrice) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'Your Payment Confirmation for Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>This is your Payment Confirmation for Siddhi Hotels</h1>
            <h2>Booking ID: ${ bookingId }</h2>
            <h2>Total Price: R ${ totalPrice.toFixed(2) }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const confirmPaymentEmail = async (email, bookingId, name, totalPrice, checkInDate, checkOutDate) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'Your Payment Confirmation for Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>Congratulations! Your Payment is Confirmed for Siddhi Hotels</h1>
            <h1>Booking Confirmed</h1>
            <h2>Booking ID: ${ bookingId }</h2>
            <h2>Total Price: R ${ totalPrice.toFixed(2) }</h2>
            <h2>Check-in Date: ${ new Date(checkInDate).toLocaleDateString() }</h2>
            <h2>Check-out Date: ${ new Date(checkOutDate).toLocaleDateString() }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const cancelBookingEmail = async (email, bookingId, name, totalPrice, refundAmount) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'Your Booking has been Cancelled',
            html: `<h1>Hello ${ name } </h1>
            <br>
            <h1>Your Booking has been Cancelled</h1>
            <h2>Booking ID: ${ bookingId }</h2>
            <h2>Total Price: R ${ totalPrice.toFixed(2) }</h2>
            <h2>Refund Amount: R ${ refundAmount.toFixed(2) }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const resetPasswordOtpEmail = async (email, otpCode, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'Your OTP for Siddhi Hotels Email Verification',
            html: `<h1>Hello ${ name } </h1>
            <br>
                <h1>This is your Account Reset Password Otp</h1>
                <h2>${ otpCode }</h2>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const resetPasswordEmail = async (email, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'This is your Account related email from Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
                <br>
                    <h1>Your Password Has Been Reset Successfully</h1>
                    <p>If you did not request this change, please contact our support team immediately.</p>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};

export const deleteAccountEmail = async (email, name) => {
    try
    {
        await transporter.sendMail({
            from: `"Siddhi Hotels" <${ process.env.MAIL_FROM } >`,
            to: email,
            subject: 'This is your Account related email from Siddhi Hotels',
            html: `<h1>Hello ${ name } </h1>
                <br>
                    <h1>Your Account Has Been Deleted</h1>
                    <p>If you did not request this change, please contact our support team immediately.</p>`
        });
    } catch (err)
    {
        throw new Error(err);
    }
};