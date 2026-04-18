const catchAsync = require('../utilities/catchAsync');
const User = require('../model/user');


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);    

    res.status(201).json({
        status: "success",
        data: newUser
    })
})