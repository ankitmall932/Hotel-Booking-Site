import jwt from 'jsonwebtoken';

export const genAccessToken = (user) => {
    return jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

export const genRefreshToken = (user) => {
    return jwt.sign({
        id: user._id
    },
        process.env.JWT_REFRESH_TOKEN,
        {
            expiresIn: '7d'
        }
    );
};