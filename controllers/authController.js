const catchAsync = require('../utilities/catchAsync');
const User = require('../model/user');
const jwt = require('jsonwebtoken');


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);
    
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KET,{expiresIn : process.env.LOGIN_EXPIRES});

    res.status(201).json({
        status: "success",
        token,
        data: newUser
    })
})