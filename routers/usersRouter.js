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

usersRouter.route('/updatePassword').patch(authController.isAuthenticate,userController.updatePassword);
usersRouter.route('/updateMe').patch(authController.isAuthenticate,userController.updateMe);
usersRouter.route('/deleteMe').delete(authController.isAuthenticate,userController.deleteMe);
usersRouter.route('/me').get(authController.isAuthenticate,userController.getDetails);

module.exports = usersRouter;