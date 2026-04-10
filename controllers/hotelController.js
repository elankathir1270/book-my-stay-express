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
    }catch{
        res.status(500).json({
            status: "fail",
            message: "Something went wrong, please try again later"
        })
    }    



}


