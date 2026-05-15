import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import { globalErrorHandler } from './middleware/global.error.js';
import ownerRouter from './routes/owner.routes.js';
import reviewRouter from './routes/review.route.js';
import './utils/cron.js';


const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/review', reviewRouter);

app.use(globalErrorHandler);

export default app;