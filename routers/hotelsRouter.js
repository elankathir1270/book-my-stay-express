const express = require('express');
const hotelsController = require('../controller/hotelController')

const hotelRouter = express.Router();

//param middleware
hotelRouter.param('id', hotelsController.checkHotelExist);

//Route Chaining
hotelRouter.route('/')
.get(hotelsController.getAll)
.post(hotelsController.validatePostBody,hotelsController.create)
/**
"validatePostBody" this middleware will act only for this post call,
so Middleware Chaining is the way to set middleware for one specific route.
 */

hotelRouter.route('/:id')
.get(hotelsController.getById)
.patch(hotelsController.update)
.delete(hotelsController.delete)

module.exports = hotelRouter;