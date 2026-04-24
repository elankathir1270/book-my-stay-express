const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const signToken = require('../utilities/signToken');
const User = require("./../model/user");


exports.updatePassword = catchAsync(async (req,res,next) => {
    //Get the details of currently logged user
    const user = await User.findById(req.user._id).select('+password');

    if(!user){
        const error = new AppError('Cannot find the user.', 404);
        return next(error);
    }
    //Compare the current password of user with saved passed
    const isMatch = await user.comparePassword(req.body.currentPassword,user.password);

    if(!isMatch){
        const error = new AppError('Provided password is wrong.', 401);
        return next(error);
    }
    
    //Update the user password with new value
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();

    await user.save();

    //Login the user and send JWT response
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
})

