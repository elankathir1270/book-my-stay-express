const catchAsync = require('../utilities/catchAsync');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');
const sendEmail = require('../utilities/email');

//Generate JWT 
const signToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRET_KET,{expiresIn : process.env.LOGIN_EXPIRES});
}

exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);
    
    //Generate a token
    const token = signToken(newUser._id);
    
    res.status(201).json({
        status: "success",
        token,
        data: newUser
    })
})

exports.login = catchAsync(async (req,res,next) => {
    const { email,password } = req.body;

    //Check email and password
    if(!email || email === ' '){
        const error = new AppError('Email is not provided', 400);
        return next(error);
    }
    if(!password || password === ' '){
        const error = new AppError('Password is not provided', 400);
        return next(error);
    }

    //Check if user with given email exist 
    const user = await User.findOne({email: email}).select("+password");
    if(!user){
        const error = new AppError("User with given email is not found", 400);
        return next(error);
    }

    //Check password matches the saved password
    const isMatch = await user.comparePassword(password, user.password);
    if(!isMatch){
        const error = new AppError("Password is not correct", 401);
        return next(error);
    }

    //Create a token and send it in response
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token,
    })
})

exports.forgotPassword = catchAsync(async (req,res,next) => {
    //Find the user based on provided email
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        const error = new AppError("Cannot find the user with provided email", 404);
        return next(error);
    }

    //Generate a token
    const plainResetToken = user.generateResetToken();
    await user.save({validateBeforeSave : false});

    //Send a email to user with password reset link
    const resetTokenLink = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${plainResetToken}`;
    const body = `We have received a password reset link, please use the below link to reset the password.\n\n ${resetTokenLink}\n\n This password link is only valid for 10 minutes.`;

    try{
    await sendEmail({
        email: user.email,
        subject: 'Password change request received',
        message: body,

    })

    //Send response
    res.status(200).json({
        status: "success",
        message: "Password reset link has been sent to user email."
    })
    }catch(error){
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save({validateBeforeSave : false});

        const err = new AppError("There was an error sending password reset email. Please try again later.", 500 );
        return next(err);
    }


})

exports.resetPassword = catchAsync(async (req,res,next) => {
})


exports.isAuthenticate = catchAsync(async(req,res,next) => {
    //Read access token from the request header
    const authToken = req.headers.authorization;
    let token = null;

    if(authToken && authToken.startsWith('Bearer')){
        token = authToken.split(' ')[1] //Bearer + access token string
    }
    if(!token) {
        const error = new AppError("You are not logged in", 401)
        return next(error)
    }    
    //Check if token is valid - not expired /not manipulated
    const decodedToken = jwt.verify(token, process.env.SECRET_KET);
    console.log(decodedToken);
    
    //If token is valid, check if user is exist
    const user = await User.findById(decodedToken.userId);

    if(!user){
        const error = new AppError("User does not exist. Access denied", 401);
        return next(error) 
    }
    
    //Check if user has changed the password after the token was issued
    const passwordWasChanged = await user.isPasswordChanged(decodedToken.iat);

    if(passwordWasChanged) {
        const error = new AppError("Password was changed, please login again");
        return next(error);
    }

    //Every check is success - allow access to protected route
    req.user = user;

    next();
});

exports.isAuthorized = (...role) => {
    return (req,res,next) => {
        if(!role.includes(req.user.role)) {
        const error = new AppError("You do not have permission to perform this action",403);
        return next(error);
    }
    next();
    }

}