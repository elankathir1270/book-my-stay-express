const catchAsync = require('../utilities/catchAsync');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);
    
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KET,{expiresIn : process.env.LOGIN_EXPIRES});

    res.status(201).json({
        status: "success",
        token,
        data: newUser
    })
})

exports.login = catchAsync(async (req,res,next) => {
    const { email,password } = req.body;

    if(!email || email === ' '){
        const error = new AppError('Email is not provided', 400);
        return next(error);
    }
    if(!password || password === ' '){
        const error = new AppError('Password is not provided', 400);
        return next(error);
    }
    //Check if user with given email exist 
    const user = await User.findOne({email: email});
    if(!user){
        const error = new AppError("User with given email is not found", 400);
        return next(error);
    }

    res.status(200).json({
        status: "success",
        token: "tokrn"
    })
})