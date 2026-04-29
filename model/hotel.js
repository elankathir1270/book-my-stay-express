const mongoose = require("mongoose");
const fs = require("fs");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      //"Hotel","Resort","Villa","Apartment","Cabin"
      type: String,
      required: [true, "Hotel type is required"],
    },
    category: {
      type: [String],
      required: true,
    },
    city: {
      type: String,
      required: [true, "Hotel city is required"],
    },
    address: {
      type: String,
      required: [true, "Hotel address is required"],
    },
    distance: {
      type: String,
      required: [true, "Hotel distance from airport is required"],
    },
    images: {
      type: [String],
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
    rooms: {
      type: [String],
    },
    cheapestPrice: {
      type: Number,
      require: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//VirtualProperty
hotelSchema.virtual("isPremium").get(function () {
  return this.cheapestPrice >= 200;
});

//This document middleware only called on .save(), .create() is called
//Not work for - insertOne(), insertMany().

hotelSchema.pre("save", function (next) {
  //console.log(this); 'this' represents document object what we try save on db.
  this.createdBy = "Elankathir";
  // next(); //next it not recommended when its not a async operation
});

hotelSchema.pre("save", async function (next) {
  if (this.cheapestPrice <= 50) {
    throw new Error("Price of hotel cannot be less than 50");
  }
  //next(); // async function doesn't need next()
});

hotelSchema.post("save", function (doc) {
  const content = `${new Date()}: A new Hotel document with ${doc.name} is created by: ${doc.createdBy}.\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" });
});

//Query middleware - it('this') can access query object where can we get methods(find,findOne) and params.
hotelSchema.pre("find", function () {
  // /^find/ - reg expression ensures this.find() will run for all kind of find events
  this.find({ isDeleted: false });
});

hotelSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate(); //object to update from client
  //console.log(update);

  if (update.cheapestPrice && update.cheapestPrice < 50) {
    throw new Error("Price of a hotel cannot be less than 50");
  }
});

hotelSchema.post("findOneAndUpdate", function (doc) {
  const content = `${new Date()}: A Hotel document with ${doc.name} is updated by: ${doc.createdBy}.\n`;
  fs.writeFileSync("./logs/log.txt", content, { flag: "a" });
});

//Aggregate middleware - here 'this' points to aggregate object
//to access properties this.pipeline()
hotelSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

hotelSchema.post("aggregate", function (result) {
  console.log(result);
});

module.exports = mongoose.model("Hotel", hotelSchema); //args: model name, schema.
