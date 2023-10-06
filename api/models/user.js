const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Pease enter your first name'],
            minlength: 3,
            maxlength: 50,
        },
        username: {
            type: String,
            required: [true, 'Pease enter your username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Pease enter your email address'],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        profilePicture: {
            type: String,
            default: "defaultPic.jpg"
        },
        followers: {
            type: [String],
            default : [],
        },
        following: {
            type: [String],
            default : [],
        },
        bio: {
            type: String,
            default: "",
        },

    }, { timestamps: true }
);

// Method to create jsonwebtoken for user -> String
userSchema.methods.createJWT = function (){
    return jwt.sign({ userId: this._id, name : this.name }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

const user = mongoose.model('User', userSchema);
module.exports = user

/*
match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|     (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                'Please provide valid email address',
            ],
*/