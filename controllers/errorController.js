module.exports = (error,req,res,next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "Error";

    res.status(statusCode).json({
        status,
        message: error.message
    })
}