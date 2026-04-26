const { status } = require("express/lib/response");
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

exports.updateMe = catchAsync(async (req,res,next) => {
    //Check if password also provided in req body
    if(req.body.password || req.body.confirmPassword){
        const error = new AppError('Use update password to change your password', 400);
        return next(error);
    }

    //Update user details
    const userDetailsToUpdate = {
        firstname: req.body.firstname || req.user.firstname,
        lastname: req.body.lastname || req.user.lastname,
        bio: req.body.bio || req.body.bio,
        address: {
            city: req.body.address.city || req.body.address.city,
            country: req.body.address.country || req.body.address.country,
        },
        contact: {
            altEmail: req.body.contact.altEmail || req.body.contact.altEmail,
            code: req.body.contact.code || req.body.contact.code,
            phone: req.body.contact.phone || req.body.contact.phone,
        }
    }

    //Save the change data in DB
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        userDetailsToUpdate,
        {runValidators : true, new: true});

    res.status(200).json({
        status: "success",
        data: {
            data: updatedUser
        }
    })    
    
})

exports.deleteMe = catchAsync(async (req,res,next) => {
    const deleteUser = await User.findByIdAndUpdate(req.user._id, {isActive : false})

    if(!deleteUser) {
        const error = new AppError('Cannot find the user to delete,', 401);
        return next(error);
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.getDetails = catchAsync(async (req,res,next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})

