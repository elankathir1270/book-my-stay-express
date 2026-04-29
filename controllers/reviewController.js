const Review = require('./../model/review');
const Hotel = require('./../model/hotel');
const User = require('./../model/user');
const catchAsync = require('../utilities/catchAsync');

exports.create = catchAsync(async (req,res,next) => {
    const reviewData = {
        ratings: req.body.ratings,
        comment: req.body.comment,
        user: req.user._id,
        hotel: req.params.hotelId

    }
    const newReview = await Review.create(reviewData);

    res.status(201).json({
        status: "success",
        data: {
            review: newReview
        }
    })
})