import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    try
    {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith(`Bearer `))
        {
            return res.status(401).json({
                message: 'Token Not Found'
            });
        }
        const token = authHeader.split(' ')[ 1 ];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user)
        {
            return res.status(401).json({
                message: 'User Not Found'
            });
        }
        req.user = user; //this include all the parts of the user
        next();
    } catch (err)
    {
        return res.status(401).json({
            message: 'Invalid Token'
        });
    }
};