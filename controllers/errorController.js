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


module.exports = (error,req,res,next) => {

    const statusCode = error.statusCode || 500;
    const status = error.status || "Error";

    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    }else{
        prodErrors(res,error);
    }

}