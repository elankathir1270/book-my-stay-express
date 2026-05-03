const mongoose = require('mongoose');
const Hotel = require('./../model/hotel');

const reviewSchema = new mongoose.Schema({
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

//this ensures a user only can give review for a hotel one time
reviewSchema.index({hotel:1, user:1}, {unique: true}); 

reviewSchema.pre(/^find/, function(){
    this.populate({
        path: 'user',
        select: 'firstname lastname photo'
    })
})

/**
  note: 
  reviewSchema.statics - creates method in collection
  reviewSchema.methods - creates method in instance of the document in collection.
 */

reviewSchema.statics.calcAverageRatings = async function(hotelId) {
    const reviewStats = await this.aggregate([
        {$match : {hotel: hotelId}},
        {$group : {
            _id : '$hotel',
            count: {$sum : 1},
            avgRating: {$avg: '$ratings'}
        }}
    ])
    
    //update reviewStats in hotel model and save it in DB
    if(reviewStats.length > 0){
        await Hotel.findByIdAndUpdate(hotelId,{
            avgRating: reviewStats[0].avgRating,
            reviewCount: reviewStats[0].count
        })
    }else{
        await Hotel.findByIdAndUpdate(hotelId,{
            avgRating: 3,
            reviewCount: 0
        })        
    }

}

reviewSchema.post('save', function() {
    //as its document middleware we use 'review model' to access 'calcAverageRatings()'
    Review.calcAverageRatings(this.hotel);
    //or
    //this.constructor.calcAverageRatings(this.hotel);
    //this.constructor - will give us model for which the instance is created
})

reviewSchema.post(/^findOneAnd/, async function(doc){ //can get 'doc' from factory functions.
    if(!doc) return //If no document was found for update/delete
    await doc.constructor.calcAverageRatings(doc.hotel);
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;