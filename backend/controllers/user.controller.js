import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Ride } from "../models/rides.model.js";
import { Rider } from "../models/rider.model.js";
import twilio from 'twilio';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
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



const sendOtp  = asyncHandler( async (req,res) => {
    const { phoneNumber } = req.body;
    try {
        await client.verify.v2
            .services(serviceSid)
            .verifications.create({
                to: phoneNumber,
                channel: 'sms',
            });
        return res.status(200).json(new ApiResponse(200, phoneNumber, "OTP sent to phone number."));
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw new ApiError(500, `Something went wrong while sending OTP: ${error.message}`);
    }
});

const verifyOtp = asyncHandler( async (req,res) => {
    const { phoneNumber, code } = req.body;
    const verification = await client.verify.v2.services(serviceSid)
    .verificationChecks.create({
        to: phoneNumber,
        code
    })

    if (verification.status !== 'approved') throw new ApiError(400, "Invalid OTP");

    return res.status(200).json(new ApiResponse(200, verification, "OTP verified"));
});

const signup = asyncHandler(async (req, res) => {
    const { phoneNumber, firstName, lastName, password, gender } = req.body;

    if (!phoneNumber || !password || !firstName || !lastName || !gender) {
        throw new ApiError(400, "Phone number, password, first name, last name, and gender are required.");
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) throw new ApiError(400, "Phone number is already registered.");

    const newUser = await User.create({
        phoneNumber,
        password,
        firstName,
        lastName,
        gender
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
    const { phoneNumber, password, notificationToken } = req.body;

    if (!phoneNumber || !password) {
        throw new ApiError(400, "Phone number and password are required.");
    }

    if(!notificationToken){
        throw new ApiError(400, "Notification token is required.")
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
    
    await User.findByIdAndUpdate(user._id, {notificationToken})
    let loggedInUser = await User.findById(user._id).select("-password -refreshToken") 

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

const getCurrentRide = asyncHandler(async (req, res) => {
    try {
        const currentRide = await Ride.findOne({
            userId: req.user._id,
            status: "Processing"
        });

        return res.status(200).json(new ApiResponse(200, currentRide, "Current ride fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching current ride")
    }
});



const updateRideRating = asyncHandler(async (req, res) => {
    try{
        const {rating} = req.body;

        const currentRide = await Ride.findOne({
            userId: req.user._id,
        }).sort({ updatedAt: -1 });

        if (!currentRide) {
            return res.status(404).json(new ApiResponse(404, null, "No ride found"));
        }

        currentRide.rating = rating;
        await currentRide.save();

        const noOfRatedRides = await Ride.countDocuments({
            driverId: currentRide.driverId,
            rating: { $exists: true, $ne: undefined }
        });
        const driver = await Rider.findById(currentRide.driverId);
        driver.ratings = (driver.ratings + rating) / noOfRatedRides;
        await driver.save();

        return res.status(200).json(new ApiResponse(200, currentRide, "Ride rating updated successfully"))

    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating ride rating")
    }
});

const getUserByPhoneNumber = asyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ phoneNumber: req.query.phoneNumber }).select("-password -refreshToken");
      if (user) {
        return res.status(200).json({ success: true, message: "User found" });
      } else {
        return res.status(200).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      throw new ApiError(500, "Something went wrong while fetching user details");
    }
});
  
const changeRiderGenderPreference = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.riderGenderPreference = req.body.preference;
        await user.save();
        return res.status(200).json(new ApiResponse(200, "Rider gender preference updated successfully"));
    } catch (error){
        throw new ApiError(500, "Something went wrong while updating")
    }
})

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
    getUserById,
    getCurrentRide,
    updateRideRating,
    getUserByPhoneNumber,
    changeRiderGenderPreference
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