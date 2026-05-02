const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");

exports.deleteOne = (Model, name) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id); //deleteOne({_id : req.params.id });

    if (!doc) {
      const error = new AppError(`The ${name} with given ID is not found`, 404);
      return next(error);
    }

    res.status(204).json({
      status: "success",
    });
  });
};

exports.updateOne = (Model, name) => {
  return catchAsync(async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(
      id , 
      body, 
      { new: true, runValidators: true, }); //updateOne({_id : id}, req.body);

    if (!doc) {
      const error = new AppError(`The ${name} with given ID is not found`, 404);
      return next(error);
    }

    if(Model.modelName === 'Room') {
        const hotelId = req.params.hotelId;
        await Model.calcCheapestPrice(hotelId);
    }

    res.status(200).json({
      status: "success",
      data: {
        [name]: doc,
      },
    });
  });
};
