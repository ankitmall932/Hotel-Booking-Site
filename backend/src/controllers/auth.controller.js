import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import { genAccessToken, genRefreshToken } from '../utils/tokens.utils.js';
import { generateOtp } from '../utils/genOtp.utils.js';
import { sendEmail } from '../utils/sendEmail.utils.js';

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
                otpExpired: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: false
            });
        }
        await sendEmail(email, otp, name);
        return res.status(201).json({
            message: 'User Register Successfully, Please Check Your Email for Otp'
        });
    } catch (err)
    {
        next(err);
    }
};

export const verifyOtp = async (req, res, next) => {
    try
    {
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
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
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
    } catch (err)
    {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try
    {
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
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
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
            await sendEmail(email, `Your reset password OTP is ${ otpCode }`);
            return res.status(200).json({
                message: 'OTP sent to your email',
            });
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
            await User.findOneAndUpdate(
                { email },
                { password: hashPass }
            );
            delete otpStore[ email ];
            return res.status(200).json({
                message: 'password reset successfully'
            });
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
        res.clearCookie('refreshToken');
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
        const token = req.cookies.refreshToken;
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
        await Session.updateMany(
            { user: decoded.id },
            { revoked: true }
        );
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout from all device are successfully' });
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