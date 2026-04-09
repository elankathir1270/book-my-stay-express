const Hotel = require('./../model/hotel.js');

exports.getAll = async (req, res) => {

    try{
        /*
        //multiple ways of filtering
        const hotels = await Hotel.find({city: "Mumbai", ratings: {$gte: 4.5}});
        const hotels = await Hotel.find()
                                .where('city').equals('Mumbai')
                                .where('ratings').gte(4); //built-in methods
         */

        //Excluding other fields not required in filter object
        const excludeFields = ['sort','limit','page','fields'];
        const queryObj = {...req.query};
        excludeFields.forEach((el) => {
            delete queryObj[el];
        })

        const optimizedQuery = getOptimizedFilterQuery(queryObj);

        //Querying the documents from the collection
        let query = Hotel.find(optimizedQuery);

        //Sorting the results(add '-' before variable in req query for desc)
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('cheapestPrice');
        }

        //Field limiting(add '-' before variable in req query for exclude)
        if(req.query.fields) {
            const fields = req.query.fields.split(",").join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }

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

const getOptimizedFilterQuery = (queyObj) => {
    const filterQuery = {}
    //Received: { city: 'Mumbai', 'cheapestPrice[lt]': '100', 'ratings[gte]': '4' }
    //Required : { city: 'Mumbai', cheapestPrice: { '$lt': '100' }, ratings: { '$gte': '4' } }

    
    for(let key in queyObj) {
        const value = queyObj[key];
        const match = key.match(/^(.*)\[(gt|gte|lt|lte)\]$/);

        if(match) {
            const fieldName = match[1];
            const operator = `$${match[2]}`;

            if(!filterQuery[fieldName]) {
                filterQuery[fieldName] = {}
            }
            filterQuery[fieldName][operator] = value;
        }else{
            filterQuery[key] = value;
        }
        
    }
    //console.log(queyObj);
    //console.log(filterQuery);
    return filterQuery;

}
