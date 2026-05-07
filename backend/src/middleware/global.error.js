const validationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);

    return {
        statusCode: 400,
        message: errors.join(', ')
    };
};

const castError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid ${ err.path }: ${ err.value }`
    };
};

const duplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[ 0 ];

    return {
        statusCode: 400,
        message: `${ field } already exists`
    };
};

const jwtError = () => {
    return {
        statusCode: 401,
        message: 'Invalid Token Please Login Again'
    };
};

export const globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    };
    if (err.name === 'ValidationError')
    {
        error = validationError(err);
    }
    if (err.name === 'CastError')
    {
        error = castError(err);
    }
    if (err.code === 11000)
    {
        error = duplicateKeyError(err);
    }
    if (err.name === 'JsonWebTokenError')
    {
        error = jwtError();
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
};