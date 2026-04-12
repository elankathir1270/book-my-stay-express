const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    type: { //"Hotel","Resort","Villa","Apartment","Cabin"
        type: String,
        required: [true, 'Hotel type is required'],
    },
    category: {
        type: [String],
        required: true
    },
    city: {
        type: String,
        required: [true, 'Hotel city is required'],
    },
    address: {
        type: String,
        required: [true, 'Hotel address is required'],
    },
    distance: {
        type: String,
        required: [true, 'Hotel distance from airport is required'],
    },
    images: {
        type: [String ]
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5
    },
    rooms: {
        type: [String]
    },
    cheapestPrice: {
        type: Number,
        require: true
    },
    featured: {
        type: Boolean,
        default: false
    }

},
{
    toJSON: {virtuals: true}, toObject: {virtuals: true}
})
    //VirtualProperty
    hotelSchema.virtual('isPremium').get(function() {
        return this.cheapestPrice >= 200
    })

module.exports = mongoose.model('Hotel', hotelSchema) //args: model name, schema.