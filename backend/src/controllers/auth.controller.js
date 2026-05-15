import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import { genAccessToken, genRefreshToken } from '../utils/tokens.utils.js';
import { generateOtp } from '../utils/genOtp.utils.js';
import { registerEmail, registeredEmail, loginEmail, resetPasswordEmail, resetPasswordOtpEmail, deleteAccountEmail } from '../utils/sendEmail.utils.js';
import { UAParser } from 'ua-parser-js'; //firstly install ua-parser-js using npm i ua-parser-js
import Device from '../models/device.model.js';
import Listing from '../models/listing.model.js';
import Booking from '../models/booking.model.js';
import cloudinary from '../config/cloudinary.js';

const otpStore = {};

export const register = async (req, res, next) => {
    try
    {
        let { name, email, password, role, currentRole } = req.body;
        email = email.toLowerCase();
        const otp = generateOtp();
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified)
        {
            return res.status(400).json({
                message: 'This email is already exists Please login'
            });
        }
        const hashPass = await bcrypt.hash(password, 10);
        let user;
        if (existingUser)
        {
            existingUser.name = name;
            existingUser.password = hashPass;
            existingUser.role = role || 'customer';
            existingUser.currentRole = currentRole || 'customer';
            existingUser.otp = otp;
            existingUser.otpExpired = new Date(Date.now() + 10 * 60 * 1000);
            existingUser.otpLastSent = new Date();
            await existingUser.save();
            user = existingUser;
        } else
        {
            user = await User.create({
                name,
                email,
                password: hashPass,
                role: role || 'customer',
                currentRole: currentRole || 'customer',
                otp,
                otpExpired: new Date(Date.now() + 5 * 60 * 1000),
                otpLastSent: new Date(),
                isVerified: false
            });
        }
        await registerEmail(email, otp, name);
        return res.status(201).json({
            message: 'User Register Successfully, Please Check Your Email for Otp'
        });
    } catch (err)
    {
        next(err);
    }
};

export const resendOtp = async (req, res, next) => {
    try
    {
        let { email } = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const now = new Date();
        if (user.otpLastSent && now - user.otpLastSent < 30000)
        {
            return res.status(429).json({
                message: 'OTP already sent, please wait before requesting again'
            });
        }
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpired = new Date(Date.now() + 5 * 60 * 1000);
        user.otpLastSent = now;
        await user.save();
        return res.status(200).json({
            message: 'OTP resent successfully, Please Check Your Email'
        });
        await registerEmail(email, otp, user.name);
    } catch (err)
    {
        next(err);
    }
};
export const verifyOtp = async (req, res, next) => {
    try
    {
        const isProduction = process.env.NODE_ENV === 'production';
        let { email, otp } = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        if (user.isVerified)
        {
            return res.status(400).json({
                message: 'User already verified please login'
            });
        }
        if (user.otp !== otp)
        {
            return res.status(400).json({
                message: 'wrong otp please retry'
            });
        }
        if (user.otpExpired < Date.now())
        {
            return res.status(400).json({
                message: 'OTP expired please request a new one'
            });
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpired = null;
        await user.save();
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        await Session.create({
            user: user._id,
            refreshToken
        });
        const parser = new UAParser(req.headers[ 'user-agent' ]);
        const result = parser.getResult();
        const browser = result.browser.name || 'Unknown Browser';
        const os = result.os.name || 'Unknown OS';
        const device = result.device.type || 'Desktop';
        const ip = req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress;
        await Device.create({
            user: user._id,
            browser,
            os,
            device,
            ip,
            token: accessToken,
            lastActive: new Date()
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: 'User register and verified Successfully',
            accessToken,
            user: {
                name: user.name,
                email: user.email,
                currentRole: user.currentRole
            }
        });
        await registeredEmail(email, user.name);
    } catch (err)
    {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try
    {
        const isProduction = process.env.NODE_ENV === 'production';
        let { email, password } = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        if (user && !user.isVerified)
        {
            return res.status(400).json({
                message: 'Email is not verified'
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match)
        {
            return res.status(400).json({
                message: 'Wrong password'
            });
        }
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        await Session.create({
            user: user._id,
            refreshToken
        });
        const parser = new UAParser(req.headers[ 'user-agent' ]);
        const result = parser.getResult();
        const browser = result.browser.name || 'Unknown Browser';
        const os = result.os.name || 'Unknown OS';
        const device = result.device.type || 'Desktop';
        const ip = req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress;
        await Device.create({
            user: user._id,
            browser,
            os,
            device,
            ip,
            token: accessToken,
            lastActive: new Date()
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: `Welcome Back ${ user.name }😎😎`,
            accessToken,
            user: {
                name: user.name,
                email: user.email,
                currentRole: user.currentRole
            }
        });
        await loginEmail(email, user.name);
    } catch (err)
    {
        next(err);
    }
};

export const deviceHistory = async (req, res, next) => {
    try
    {
        const devices = await Device.find({
            user: req.user._id,
        }).sort({ lastActive: -1 });
        const updateDevices = devices.map((device) => ({
            ...device._doc,
            currentDevice: device.token === req.token,
        }));
        res.json({ updateDevices });
    } catch (err)
    {
        next(err);
    }
};
export const resetPassword = async (req, res, next) => {
    try
    {
        let { email, otp, password } = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        if (user && !user.isVerified)
        {
            return res.status(400).json({
                message: 'Firstly verify the email'
            });
        }
        if (!otp)
        {
            const otpCode = generateOtp();
            otpStore[ email ] = {
                otp: otpCode,
                expiry: Date.now() + 10 * 60 * 1000
            };
            return res.status(200).json({
                message: 'OTP sent to your email',
            });
            await resetPasswordOtpEmail(email, otpCode, user.name);
        }
        else
        {
            const data = otpStore[ email ];
            if (!data)
            {
                return res.status(400).json({
                    message: 'no otp request found'
                });
            }
            if (data.otp !== otp)
            {
                return res.status(400).json({
                    message: 'Invalid Otp'
                });
            }
            if (data.expiry < Date.now())
            {
                return res.status(400).json({
                    message: 'OTP Expired'
                });
            }
            const hashPass = await bcrypt.hash(password, 10);
            const user = await User.findOneAndUpdate(
                { email },
                { password: hashPass }
            );
            delete otpStore[ email ];
            return res.status(200).json({
                message: 'password reset successfully'
            });
            await resetPasswordEmail(email, user.name);
        }
    } catch (err)
    {
        next(err);
    }
};

export const refresh = async (req, res, next) => {
    try
    {
        const token = req.cookies.refreshToken;
        if (!token)
        {
            return res.status(401).json({
                message: 'Token not found'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
        const user = await User.findById(decoded.id);
        if (!user)
        {
            return res.status(404).json({
                message: 'user not found'
            });
        }
        const session = await Session.findOne({
            refreshToken: token,
            revoked: false
        });
        if (!session)
        {
            return res.status(401).json({
                message: 'Invalid session'
            });
        }
        const accessToken = genAccessToken(user);
        return res.status(200).json({
            accessToken
        });
    } catch (err)
    {
        next(err);
    };
};

export const logout = async (req, res, next) => {
    try
    {
        const isProduction = process.env.NODE_ENV === 'production';
        const token = req.cookies.refreshToken;
        if (!token)
        {
            return res.status(400).json({
                message: 'Tokens not found'
            });
        }
        await Session.findOneAndUpdate(
            { refreshToken: token },
            { revoked: true }
        );
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        res.json({
            message: 'Logged out Successfully'
        });
    } catch (err)
    {
        next(err);
    }
};

export const logoutAll = async (req, res, next) => {
    try
    {
        const isProduction = process.env.NODE_ENV === 'production';
        const token = req.cookies.refreshToken;
        if (!token)
        {
            return res.status(400).json({
                message: 'Token not found'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
        await Session.updateMany({ user: decoded.id }, { revoked: true });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        res.json({
            message: 'Logged out from all devices successfully'
        });
    } catch (err)
    {
        next(err);
    }
};

export const switchUser = async (req, res, next) => {
    try
    {
        const { role } = req.body;
        const user = await User.findById(req.user._id);
        if (!user)
        {
            res.status(400).json({
                message: 'User not Found'
            });
        }
        user.currentRole = role;
        await user.save();
        return res.status(200).json({
            message: 'Account change Successfully',
            user: {
                name: user.name,
                email: user.email,
                currentRole: user.currentRole
            }
        });
    } catch (err)
    {
        next(err);
    }
};

export const deleteAccount = async (req, res, next) => {
    try
    {
        const isProduction = process.env.NODE_ENV === 'production';
        const userId = req.user._id;
        const listings = await Listing.find({ owner: userId });
        const listingIds = listings.map(listing => listing._id);
        for (const listing of listings)
        {
            if (listing.images?.length > 0)
            {
                for (const image of listing.images)
                {
                    if (image.public_id)
                    {
                        await cloudinary.uploader.destroy(image.public_id);
                    }
                }
            }
        }
        await Booking.deleteMany({
            listing: { $in: listingIds }
        });
        await Booking.deleteMany({
            user: userId
        });
        await Listing.deleteMany({
            owner: userId
        });
        await Session.deleteMany({
            user: userId
        });
        await Device.deleteMany({
            user: userId
        });
        await User.findByIdAndDelete(userId);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        return res.status(200).json({
            message: 'Account Deleted Successfully'
        });
        await deleteAccountEmail(req.user.email, req.user.name);
    } catch (err)
    {
        next(err);
    }
};