const catchAsync = require('../utilities/catchAsync');
const Room = require('./../model/room');
const Hotel = require('./../model/hotel');


exports.create = catchAsync(async(req,res,next) => {
    const hotelId = req.params.hotelId;
    const newRoom = await Room.create(req.body);

    await Hotel.findByIdAndUpdate(hotelId, {$push: {rooms: newRoom._id}})

        res.status(201).json({
            status: "success",
            data: {
                room: newRoom
            }
        })    
})