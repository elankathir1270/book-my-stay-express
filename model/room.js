const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPerson: {
        type: Number,
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    bookedDates: [Date]
    
});

module.exports = mongoose.model('Room', roomsSchema);