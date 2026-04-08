const express = require('express');
const hotelsController = require('../controllers/hotelController')

const hotelRouter = express.Router();

//Route Chaining
hotelRouter.route('/')
.get(hotelsController.getAll)
.post(hotelsController.create)
                 
hotelRouter.route('/:id')
.get(hotelsController.getById)
.patch(hotelsController.update)
.delete(hotelsController.delete)

module.exports = hotelRouter;