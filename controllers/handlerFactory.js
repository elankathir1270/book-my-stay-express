const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');

exports.deleteOne = (Model,name) => {
    return catchAsync(async (req,res,next) => {
       
            const doc = await Model.findByIdAndDelete(req.params.id); //deleteOne({_id : req.params.id });
    
            if(!doc) {
                const error = new AppError(`The ${name} with given ID is not found`, 404)
                return next(error);
            }       
    
            res.status(204).json({
                status: "success",
            })
    })
}