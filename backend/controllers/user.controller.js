import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Ride } from "../models/rides.model.js";
import twilio from 'twilio';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, { lazyLoading: true });

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        throw new ApiError(401, "Unauthorized request: No cookies found");
    }

    const cookieArray = cookies.split('; ');
    const cookieObj = {};
    
    cookieArray.forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookieObj[key] = value;
    });

    const incomingRefreshToken = cookieObj['refreshToken'] || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: No refresh token provided");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }
});



const sendOtp  = asyncHandler( async (phoneNumber) => {

    await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({
        to: phoneNumber,
        channel: 'sms'
    })

    return res.status(200).json(new ApiResponse(200, phoneNumber, "OTP sent to phone number."));
});

const verifyOtp = asyncHandler( async (phoneNumber, code) => {
    
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks.create({
        to: phoneNumber,
        code
    })

    if (verification.status !== 'approved') throw new ApiError(400, "Invalid OTP");

    return res.status(200).json(new ApiResponse(200, verification, "OTP verified"));
});

const signup = asyncHandler(async (req, res) => {
    const { phoneNumber, firstName, lastName, password } = req.body;

    if (!phoneNumber || !password || !firstName || !lastName) {
        throw new ApiError(400, "Phone number, password, first name, and last name are required.");
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) throw new ApiError(400, "Phone number is already registered.");

    const newUser = await User.create({
        phoneNumber,
        password,
        firstName,
        lastName,
    });

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(newUser._id);
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:createdUser,accessToken,refreshToken
            },
            "User registered and loggedin Successfully"
        )
    )
});

const login = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        throw new ApiError(400, "Phone number and password are required.");
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new ApiError(401, "Invalid phone number or password.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404," Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User loggedin successfully"
        )
    )
});

const logout = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1 //this removes the field from the document
            },
            
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secur: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,"null","User logged Out"))
});

const currentUser = asyncHandler(async (req, res) => {
    try{
        const  user = await User.findById(req.user._id).select("-password -refreshToken")
        return res.status(200).json(new ApiResponse(200, user, "User details"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching user details")
    }
});

const getAllRides = asyncHandler(async (req, res) => {
    try{
        const rides = await Ride.find({userId:req.user._id}).populate("driverId")
        return res.status(200).json(new ApiResponse(200, rides, "User rides"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching user rides")
    }
});

const getUserById = asyncHandler(async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select("-password -refreshToken")
        return res.status(200).json(new ApiResponse(200, user, "User details"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching user details")
    }
});

const hello = asyncHandler(
    async (req, res) => {
        return res.status(200).json(
            new ApiResponse(200, null,"Hello user")
        )
    }
);

export {
    sendOtp,
    verifyOtp,
    signup,
    login,
    logout,
    hello,
    refreshAccessToken,
    currentUser,
    getAllRides,
    getUserById
};

//signup using phone number
//signup using email
//login using phone number
//login using email
//logout

//currentUser
//ride request / view available drivers
//track rider location
//view ride history
//make payment
//cancel ride
//rate rider