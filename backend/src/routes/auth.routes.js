import express from 'express';
import * as controllers from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/schema.validate.js';
import resetPasswordSchema from '../validation/resetPassword.validator.js';
import registerSchema from '../validation/register.validator.js';
import loginSchema from '../validation/login.validator.js';


const router = express.Router();

router.post('/register', validateSchema(registerSchema), controllers.register);

router.post('/verifyOtp', controllers.verifyOtp);

router.post('/login', validateSchema(loginSchema), controllers.login);

router.post('/resetPassword', validateSchema(resetPasswordSchema), protect, controllers.resetPassword);

router.post('/logout', protect, controllers.logout);

router.post('/logoutAll', protect, controllers.logoutAll);

router.post('/refresh', controllers.refresh);

router.post('/switchUser', protect, controllers.switchUser);


export default router;