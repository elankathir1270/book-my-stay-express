const express = require('express');
const roomsController = require('../controllers/roomsController');
const authController = require('../controllers/authController');

const roomRouter = express.Router({mergeParams : true});
//to access parent route params from child router ('roomRouter') need to pass this config object {mergeParams : true}.       

roomRouter.route('/')
.post(
    authController.isAuthenticate,
    authController.isAuthorized('admin'),
    roomsController.create
)
.get(roomsController.getAll)

roomRouter.route('/:id').delete(
    authController.isAuthenticate,
    authController.isAuthorized('admin'),
    roomsController.delete
)
.get(roomsController.getById)
.patch(
    authController.isAuthenticate,
    authController.isAuthorized('admin'),
    roomsController.update
)



module.exports = roomRouter;