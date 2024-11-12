import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
});

const riderSchema = new Schema(
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
        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        vehicleModel: {
            type: String,
            required: true,
            trim: true
        },
        isElectric: {
            type: Boolean,
            default: false
        },
        vehicleManufacturer: {
            type: String,
            required: true,
            trim: true
        },
        drivingLicense: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        vehicleRegistrationCertificate: {
            type: String,
            required: true,
            trim: true
        },
        notificationToken: {
            type: String,
            default: null
        },
        ratings: {
            type: Number,
            default: 0
        },
        totalEarning: {
            type: Number,
            default: 0
        },
        totalRides: {
            type: Number,
            default: 0
        },
        pendingRides: {
            type: Number,
            default: 0
        },
        cancelRides: {
            type: Number,
            default: 0
        },
        upiId:{
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: "inactive"
        }
    },
    {
        timestamps: true
    }
);

riderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

riderSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

riderSchema.methods.generateAccessToken = function () {
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

riderSchema.methods.generateRefreshToken = function () {
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

export const Rider = mongoose.model("Rider", riderSchema);
