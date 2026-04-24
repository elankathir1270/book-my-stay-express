const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController')

const usersRouter = express.Router();

//param middleware
const paramMiddleware = (req,res,next,value,name) => {
    console.log("Id route parameter value: " + value);
    next(); 
}
usersRouter.param('id', paramMiddleware);

usersRouter.route('/updatePassword').patch(authController.isAuthenticate,userController.updatePassword)


module.exports = usersRouter;