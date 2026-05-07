import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.body.email || ipKeyGenerator(req.ip),
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'To many attempts, Please login after some time'
    }
});

export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'To many attempts, Please enter otp after some time'
    }
});