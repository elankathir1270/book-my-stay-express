const catchAsync = require('../utilities/catchAsync');
const Room = require('./../model/room');
const Hotel = require('./../model/hotel');
const req = require('express/lib/request');


exports.create = catchAsync(async (req,res,next) => {
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

exports.delete = catchAsync(async (req,res,next) => {
    const hotelId = req.params.hotelId;

    //Deleting room document
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    //Updating it in hotel document(remove it in hotel document also)
    await Hotel.findByIdAndUpdate(hotelId, {$pull: {rooms: req.params.id}});

    res.status(204).json({
        status: "success",
        data: {
            room: deletedRoom
        }
    });
    
})

exports.getAll = catchAsync(async (req,res,next) => {
    const rooms = await Room.find();

    res.status(200).json({
        status: "success",
        count: rooms.length,
        data: {
            rooms
        }
    })
});

exports.getById = (async (req,res,next) => {
    const room = await Room.findById(req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            room
        }
    })    
})