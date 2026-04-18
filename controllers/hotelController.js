const ApiFeature = require('./../utilities/features');
const Hotel = require('./../model/hotel.js');
const AppError = require('./../utilities/appError');
const catchAsync = require('../utilities/catchAsync');



exports.getAll = catchAsync(async (req, res,next) => {

    const features = new ApiFeature(Hotel.find(), req.query);

    const query  = features.filter().sort().limitFields().paginate().queryObj;

    const hotels = await query;

        res.status(200).json({
            status: "success",
            count: hotels.length,
            data: {
                hotels
            }
        })

})

exports.create = catchAsync(async (req,res,next) => {

    const hotel = await Hotel.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                hotel
            }
        })
})

exports.getById = catchAsync(async (req,res,next) => {
        const id = req.params.id;    
        const hotel = await Hotel.findById(id);//findOne({_id: id});

        if(!hotel) {
            const error = new AppError('The hotel with given ID is not found', 404)
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: {
                hotel
            }
        })

})

exports.update = catchAsync(async (req,res,next) => {

        const body = req.body;
        const id = req.params.id;
        const updatedHotel = await Hotel.findOneAndUpdate( {_id: id}, body, { new: true, runValidators: true }); //updateOne({_id : id}, req.body);  
        
        if(!updatedHotel) {
            const error = new AppError('The hotel with given ID is not found', 404)
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: {
                hotel : updatedHotel
            }
        })

})

exports.delete = catchAsync(async (req,res,next) => {
   
        const deleteHotel = await Hotel.findByIdAndDelete(req.params.id); //deleteOne({_id : req.params.id });

        if(!deleteHotel) {
            const error = new AppError('The hotel with given ID is not found', 404)
            return next(error);
        }       

        res.status(204).json({
            status: "success",
        })
})

//Get all featured hotels
exports.getFeaturedHotels = catchAsync(async (req,res,next) => {

        const featuredHotels = await Hotel.aggregate([
            {$match: {featured: true}},
            {$sort: {ratings: -1}},
            {$limit: 4}
        ])

        res.status(200).json({
            status: "success",
            data: {
                featured: featuredHotels
            }
        })

})

//Get the hotels by city
exports.getHotelsByCity = catchAsync(async (req,res,next) => {

        const hotelsByCity = await Hotel.aggregate([
            {$group:{
                _id: "$city",
                hotels: {$push: "$name"},
                count: {$sum: 1},
                cheapestPrice: {$min : "$cheapestPrice"}
            }},
            {$addFields: {city: "$_id"}},
            {$project: {_id : 0}},
            {$sort: {count : -1}},
            {$limit: 4}

        ])

        res.status(200).json({
            status: "success",
            data:{
                hotels: hotelsByCity
            }
        })


}) 

//Get the hotels by type
exports.getHotelsByType = catchAsync(async (req,res,next) => {

        const hotelsByType = await Hotel.aggregate([
            {$group:{
                _id: "$type",
                hotels: {$push: "$name"},
                count: {$sum: 1},
            }},
            {$addFields: {type: "$_id"}},
            {$project: {_id : 0}},
            {$sort: {count : -1}},
            {$limit: 3}

        ])

        res.status(200).json({
            status: "success",
            data:{
                hotels: hotelsByType
            }
        })

}) 


/**
//To know the use of Aggregate framework
exports.getHotelStats = async (req,res) => {
    try{
        const stats = await Hotel.aggregate([
            { $match: { type: 'Hotel'}},
            { $group: {
                _id: '$city',  // or 'null' will return only one value. 
                avgRatings: { $avg : '$ratings'},
                minPrice: { $min: '$cheapestPrice'},
                maxPrice: { $max: '$cheapestPrice'},
                totalPrice: { $sum: '$cheapestPrice'},
                count: { $sum: 1 }
            }},
            { $sort: { minPrice : 1}}, //for desc '-1'
            // { $match: { count: { $gte: 2 }}},
            // { $sort: { count : -1}}

        ]);

        res.status(200).json({
            status: "success",
            count: stats.length,
            data: {
                stats
            }
        })

    }catch(error) {
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later" + error.message
        })
    }
}

exports.getHotelsByCategory = async (req,res) => {
    try{
        const category = req.params.category;        

        const hotels = await Hotel.aggregate([
            {$unwind : '$category'},
            {$group: {
                _id: "$category",
                count: {$sum: 1},
                hotels: {$push: "$name"}

            }},
            {$addFields: {category: '$_id'}},
            {$project: {_id: 0}},
            {$match: { category : category}},
            {$sort: {count: -1}},
            //{$limit: 5}
        ])

        res.status(200).json({
            status: "success",
            count: hotels.length,
            data: {
                hotels
            }

        })

    }catch(error) {
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later" + error.message
        })
    }
}
 */



