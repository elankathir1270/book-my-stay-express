const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: [true, "Firstname is a required field"],
        trim: true,
        lowercase: true,
        validate: [validator.isAlpha, "First name can only contain letters."]
    },
    lastname: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isAlpha, "Last name can only contain letters."]
    },
    email: {
        type: String,
        require: [true, "Email is a required field"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, "Provided email is not valid"]
    },
    photo: String,
    password: {
        type: String,
        require: [true, "Password is a required field"],
        trim: true,
        minlength: 6
    },
    confirmPassword: {
        type: String,
        require:  [true, "Confirm Password is a required field"],
        trim: true,
        minlength: 6
    }

},{ timestamps: true}) //this additional option will add and update, createdAt and updatedAt timings.

module.exports = mongoose.model('User', userSchema);