const express = require('express');
const hotelsController = require('../controllers/hotelController')
const authController = require('../controllers/authController')
const roomsRouter = require('../routers/roomsRouter');
const reviewRouter = require('../routers/reviewRouter');

const hotelRouter = express.Router();

//nested routes
hotelRouter.use('/:hotelId/rooms', roomsRouter); //mounting the rooms router to this path
hotelRouter.use('/:hotelId/reviews', reviewRouter); //mounting the review router to this path

hotelRouter.route('/get-featured')
.get(hotelsController.getFeaturedHotels);
hotelRouter.route('/get-hotels-by-city')
.get(hotelsController.getHotelsByCity);
hotelRouter.route('/get-hotels-by-type')
.get(hotelsController.getHotelsByType);

hotelRouter.route('/')
.get(hotelsController.getAll)
.post(authController.isAuthenticate,authController.isAuthorized('admin','super'),hotelsController.create)
                 
hotelRouter.route('/:id')
.get(hotelsController.getById)
.patch(authController.isAuthenticate,authController.isAuthorized('admin'),hotelsController.update)
.delete(authController.isAuthenticate,authController.isAuthorized('admin','super'),hotelsController.delete)


/**
//used for aggregate  
 
hotelRouter.route('/get-hotel-stats')
.get(hotelsController.getHotelStats);
hotelRouter.route('/get-hotel-by-category/:category')
.get(hotelsController.getHotelsByCategory);
 */

module.exports = hotelRouter;