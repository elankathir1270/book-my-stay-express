const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
        unique: [true, "A user with same email is already exists"],
        validate: [validator.isEmail, "Provided email is not valid"]
    },
    photo: String,
    password: {
        type: String,
        require: [true, "Password is a required field"],
        trim: true,
        minlength: 6,
        select: false
    },
    confirmPassword: {
        type: String,
        require:  [true, "Confirm Password is a required field"],
        trim: true,
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Password and Confirm password do not match"
        }
    },
    passwordChangedAt : Date,
    role: {
        type: String,
        enum: ["user", "admin", "super"],
        default: "user"
    },
    resetToken: String,
    resetTokenExpiresAt: Date

},{ timestamps: true}) //this additional option will add and update, createdAt and updatedAt timings.

/**
 note:
 Validation will be completed before the pre hook (pre('save')) run.
 Pre hook (pre('save')) will run before data is saved to db.
 */

userSchema.pre('save',async function() {
    //Skip hashing if password is not modified
    if(!this.isModified('password')) return; //this.isModified() is a built-in Mongoose document method.

    //Hash the password
    //const salt = bcrypt.genSalt(10) or 10
    this.password = await bcrypt.hash(this.password, 10);

    //Remove confirmPassword field from saved document.
    this.confirmPassword = undefined;
})

//Instance method
userSchema.methods.comparePassword = async(password, savedPassword) => {
    return bcrypt.compare(password, savedPassword);
}

userSchema.methods.isPasswordChanged = async function(tokenIssuedAt) {

    if(this.passwordChangedAt) {
        const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        return tokenIssuedAt < passwordChangeTimestamp;  
    }
    return false
}

userSchema.methods.generateResetToken = function() {
    //creating token
    const resetToken = crypto.randomBytes(32).toString('hex');
    //hashing token
    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpiresAt = Date.now() + (10 * 60 * 1000); //10 minis with ms

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);