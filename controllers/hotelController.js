const ApiFeature = require('./../utilities/features');
const Hotel = require('./../model/hotel.js');

//Alias route
exports.getFeaturedHotels = (req,res,next) => {
    Object.defineProperty(req,"query",{
        value: {...req.query, featured : "true", sort : "-ratings",limit : "5"},
        writable: true
    })
    next();
}

exports.getAll = async (req, res) => {

    const features = new ApiFeature(Hotel.find(), req.query);

    try{
        const query  = features.filter().sort().limitFields().paginate().queryObj;

        const hotels = await query;

        res.status(200).json({
            status: "success",
            count: hotels.length,
            data: {
                hotels
            }
        })
    }catch{
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }


}

exports.create = async (req,res) => {
    try{
        //const hotel = new Hotel(req.body);
        //const newHotel = await hotel.save();
        //OR

        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                hotel
            }
        })
    }catch{
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }

}


exports.getById = async (req,res) => {
    try{
        const id = req.params.id;    
        const hotel = await Hotel.findById(id);//findOne({_id: id});

        res.status(200).json({
            status: "success",
            data: {
                hotel
            }
        })
    }catch{
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }

}

exports.update = async (req,res) => {
    try{
        const body = req.body;
        const id = req.params.id;
        const updatedHotel = await Hotel.findByIdAndUpdate( id, body, { new: true, runValidators: true }); //updateOne({_id : id}, req.body);    

        res.status(200).json({
            status: "success",
            data: {
                hotel : updatedHotel
            }
        })
    }catch{
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }

}

exports.delete = async (req,res) => {
    try{    
        await Hotel.findByIdAndDelete(req.params.id); //deleteOne({_id : req.params.id });

        res.status(204).json({
            status: "success",
        })
    }catch(error) {
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }    



}

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


