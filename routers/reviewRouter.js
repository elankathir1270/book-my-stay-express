const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const reviewRouter = express.Router({mergeParams : true});

reviewRouter.route('/')
.post(
    authController.isAuthenticate,
    authController.isAuthorized('user'),
    reviewController.create
)

module.exports = reviewRouter;