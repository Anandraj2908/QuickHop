import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
});

const userSchema = new Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female"], 
            required: true,
        },
        avatar: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        notificationToken: {
            type: String,
            default: null
        },
        totalSpending: {
            type: Number,
            default: 0
        },
        totalRides: {
            type: Number,
            default: 0
        },
        riderGenderPreference: {
            type: String,
            enum:["Male", "Female", "Both"],
            default: "Both"
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            phoneNumber: this.phoneNumber,
            firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);
