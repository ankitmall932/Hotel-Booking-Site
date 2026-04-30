
const validationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return {
        statusCode: 400,
        message: errors.join(', ')
    };
};

export const globalErrorHandler = ((err, req, res, next) => {
    console.log(err);
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    };
    if (err.name === 'ValidationError')
    {
        error = validationError(err);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
});
