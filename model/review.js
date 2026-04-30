const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    ratings: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: true
    }
},{timestamp: true});

reviewSchema.pre(/^find/, function(){
    this.populate({
        path: 'user',
        select: 'firstname lastname photo'
    })
})

module.exports = mongoose.model('Review', reviewSchema);