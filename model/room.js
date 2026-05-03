const mongoose = require('mongoose');
const Hotel = require('./hotel');

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


roomsSchema.statics.calcCheapestPrice = async function(hotelId) {
    const hotel = await Hotel.findById(hotelId).select('rooms').lean(); //lean() to get as js object.

    if(!hotel) return;

    if(!hotel.rooms || hotel.rooms.length === 0) {
        await Hotel.findByIdAndUpdate(hotelId, {cheapestPrice : 120});
        return; 
    }

    const stats = await this.aggregate([
        {$match: {_id: {$in : hotel.rooms}}},
        {$group: {
            _id: null,
            minPrice: {$min : '$price'}
        }}
    ])
    //console.log(stats);

    //update cheapestPrice in hotel doc from Hotel collection 
    await Hotel.findByIdAndUpdate(hotelId, {cheapestPrice: stats[0].minPrice});
}

module.exports = mongoose.model('Room', roomsSchema);