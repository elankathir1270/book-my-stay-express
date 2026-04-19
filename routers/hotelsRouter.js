const express = require('express');
const hotelsController = require('../controllers/hotelController')
const authController = require('../controllers/authController')

const hotelRouter = express.Router();

hotelRouter.route('/get-featured')
.get(hotelsController.getFeaturedHotels);
hotelRouter.route('/get-hotels-by-city')
.get(hotelsController.getHotelsByCity);
hotelRouter.route('/get-hotels-by-type')
.get(hotelsController.getHotelsByType);

hotelRouter.route('/')
.get(hotelsController.getAll)
.post(authController.isAuthenticate,hotelsController.create)
                 
hotelRouter.route('/:id')
.get(hotelsController.getById)
.patch(authController.isAuthenticate,hotelsController.update)
.delete(authController.isAuthenticate,hotelsController.delete)


/**
//used for aggregate  
 
hotelRouter.route('/get-hotel-stats')
.get(hotelsController.getHotelStats);
hotelRouter.route('/get-hotel-by-category/:category')
.get(hotelsController.getHotelsByCategory);
 */

module.exports = hotelRouter;