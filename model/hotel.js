const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        unique: [true, 'Hotel name must be unique'],
        minLength: [3, 'Hotel name must have minimum 3 characters'],
        maxLength : [25, 'Hotel name would not exceed maximum 25 characters'],
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'Hotel price is required'],
        min: [100, "price must be minimum 100"],
        max: [10000, "price can be maximum 10000"]
    },
    city: {
        type: String,
        required: [true, 'Hotel city is required'],
    },
    ratings:{
        type: Number,
        default: 1.0
    }
})

module.exports = mongoose.model('Hotel', hotelSchema) //args: model name, schema.