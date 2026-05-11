import express from 'express';
import * as controllers from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/schema.validate.js';
import resetPasswordSchema from '../validation/resetPassword.validator.js';
import registerSchema from '../validation/register.validator.js';
import loginSchema from '../validation/login.validator.js';
import * as rateLimit from '../middleware/rateLimit.middleware.js';


const router = express.Router();

router.post('/register', validateSchema(registerSchema), controllers.register);

router.post('/resendOtp', rateLimit.otpLimiter, controllers.resendOtp);

router.post('/verifyOtp', controllers.verifyOtp);

router.post('/login', rateLimit.loginLimiter, validateSchema(loginSchema), controllers.login);

router.get('/device', protect, controllers.deviceHistory);

router.post('/resetPassword', rateLimit.otpLimiter, validateSchema(resetPasswordSchema), controllers.resetPassword);

router.post('/logout', protect, controllers.logout);

router.post('/logoutAll', protect, controllers.logoutAll);

router.post('/refresh', controllers.refresh);

router.post('/switchUser', protect, controllers.switchUser);

router.delete('/delete-account', protect, controllers.deleteAccount);



export default router;