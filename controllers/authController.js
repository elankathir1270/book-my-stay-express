const catchAsync = require('../utilities/catchAsync');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');

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