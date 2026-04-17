const AppError = require('./../utilities/appError')

const devErrors = (res,error) => {

        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stackTrace: error.stackTrace,
            error: error
        })
}

const prodErrors = (res,error) => {
    if(error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    }else{
        res.status(error.statusCode).json({
            status: 'error',
            message: 'Something went wrong please try again later'
        })
    }

}

const handleCastError = (error) => {
    const errorMessage = `Invalid value ${error.value}, for the property ${error.path}.`
    return new AppError(errorMessage,400);
}

module.exports = (error,req,res,next) => {

    error.statusCode = error.statusCode || 500;
    error.status = error.status || "Error";

    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    }
    else{
        let appError = {...error}
        if(error.name === 'CastError'){
            appError = handleCastError(error);
        }

        prodErrors(res,appError);
    }

}