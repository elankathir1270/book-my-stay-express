const express = require('express');
const roomsController = require('../controllers/roomsController');
const authController = require('../controllers/authController');

const roomRouter = express.Router();

roomRouter.route('/:hotelId').post(
    authController.isAuthenticate,
    authController.isAuthorized('admin'),
    roomsController.create
)


module.exports = roomRouter;