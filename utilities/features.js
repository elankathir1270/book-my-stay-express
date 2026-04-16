class ApiFeatures {
    constructor(queryObject,queryParam){
        this.queryObj = queryObject;
        this.queryParam = queryParam
    }

    filter(){
        /*
        //multiple ways of filtering
        const hotels = await Hotel.find({city: "Mumbai", ratings: {$gte: 4.5}});
        const hotels = await Hotel.find()
                                .where('city').equals('Mumbai')
                                .where('ratings').gte(4); //built-in methods
         */

        //Excluding other fields not required in filter object
        const excludeFields = ['sort','limit','page','fields'];
        const queryObj = {...this.queryParam};
        excludeFields.forEach((el) => {
            delete queryObj[el];
        })

        const optimizedQuery = getOptimizedFilterQuery(queryObj);

        //Querying the documents from the collection
        this.queryObj = this.queryObj.find(optimizedQuery);

        return this; //this represents current object -> (queryObj);
    }

    //Sorting the results(add '-' before variable in req query for desc)
    sort() {        
        if(this.queryParam.sort) {
            //Sort by multiple fields, example: sort= -cheapestPrice,ratings
            const sortBy = this.queryParam.sort.split(',').join(' ');
            this.queryObj = this.queryObj.sort(sortBy);
        }else{
            this.queryObj = this.queryObj.sort('cheapestPrice');
        }
        return this; 
    }

    //Field limiting(add '-' before variable in req query for exclude)
    limitFields() {
        if(this.queryParam.fields) {
            const fields = this.queryParam.fields.split(",").join(' ');
            this.queryObj = this.queryObj.select(fields);
        }else{
            this.queryObj = this.queryObj.select('-__v');
        }
        return this;
    }

    //Pagination
    paginate() {
        const limit = this.queryParam.limit;
        const page = this.queryParam.page || 1;
        const skip = (page - 1) * limit;
        
        this.queryObj  = this.queryObj.skip(skip).limit(limit);

        // if(this.queryParam.page) {
        //     const totalDocuments = this.queryObj.countDocuments();
        //     if(skip >= totalDocuments){
        //         throw new Error("This page is not found")
        //     }
        // }
        return this;
    }

}

    getOptimizedFilterQuery = (queyObj) => {
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

module.exports = ApiFeatures;