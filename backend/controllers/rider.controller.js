import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Rider } from "../models/rider.model.js";
import { Ride } from "../models/rides.model.js";
import { User } from "../models/user.model.js";
import twilio from 'twilio';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken, { lazyLoading: true });


const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await Rider.findById(userId)
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

        const user = await Rider.findById(decodedToken._id);

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
    const { 
        phoneNumber, 
        firstName, 
        lastName, 
        password, 
        vehicleNumber, 
        vehicleModel, 
        vehicleManufacturer, 
        drivingLicense, 
        vehicleRegistrationCertificate,
        upiId ,
        gender
    } = req.body;

    if (!phoneNumber || !password || !firstName || !lastName ||
        !vehicleNumber || !vehicleModel || !vehicleManufacturer ||
        !drivingLicense || !vehicleRegistrationCertificate || !gender) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await Rider.findOne({ phoneNumber });
    if (existingUser) throw new ApiError(400, "Phone number is already registered.");

    const newRider = await Rider.create({
        phoneNumber,
        password,
        firstName,
        lastName,
        vehicleNumber,
        vehicleModel,
        vehicleManufacturer,
        drivingLicense,
        vehicleRegistrationCertificate,
        upiId,
        gender
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newRider._id);
    const createdRider = await Rider.findById(newRider._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdRider,
                    accessToken,
                    refreshToken,
                },
                "Rider registered and logged in successfully."
            )
        );
});

const login = asyncHandler(async (req, res) => {
    const { phoneNumber, password, notificationToken } = req.body;

    if (!phoneNumber || !password) {
        throw new ApiError(400, "Phone number and password are required.");
    }

    if (!notificationToken) {
        throw new ApiError(400, "Notification token is required.");
    }

    const user = await Rider.findOne({ phoneNumber });
    if (!user) {
        throw new ApiError(401, "Invalid phone number or password.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404," Invalid rider credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    await Rider.findByIdAndUpdate( user._id, { notificationToken });
    const loggedInUser = await Rider.findById(user._id).select("-password -refreshToken")

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
            "Rider loggedin successfully"
        )
    )
});

const logout = asyncHandler(async (req, res) => {
    
    await Rider.findByIdAndUpdate(
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
    .json(new ApiResponse(200,"null","Rider logged Out"))
});

const getCurrentRider = asyncHandler(async (req, res) => {
    const rider = await Rider.findById(req.user._id).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, rider, "Rider details fetched successfully"));
});

const updateRiderStatus = asyncHandler(async (req, res) => {
    try{
        const {status} = req.body;
        if(!status) throw new ApiError(400, "Status is required");

        const rider = await Rider.findByIdAndUpdate(
            req.user._id,
            { status },
            { new: true }
        );

        if (!rider) {
            throw new ApiError(404, "Rider not found");
        }

        return res.status(200).json(new ApiResponse(200, rider, "Rider status updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating rider status")
    }
});
 
const getRidersByID = asyncHandler(async (req,res) => {
    try{
        const {ids} = req.body;
        
        if(!ids) throw new ApiError(400, "Rider IDs are required");

        const riderIds = ids.split(',').map(id => id.trim());

        const riders = await Rider.find({
            _id: {
                $in: riderIds
            }
        }).select("-password -refreshToken");

        return res.status(200).json(new ApiResponse(200, riders, "Riders fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching riders")
    }
});

const createNewRide = asyncHandler(async (req, res) => {
    try{
        const {userId, charge, status, currentLocationName, destinationLocationName, distance} = req.body;

        if(!userId || !charge || !status || !currentLocationName || !destinationLocationName || !distance) {
           throw new ApiError(400, "All fields are required");
        }

        const newRide = await Ride.create({
            userId,
            driverId: req.user._id,
            charge,
            status,
            currentLocationName,
            destinationLocationName,
            distance
        });


        return res.status(200).json(new ApiResponse(200, newRide, "Ride created successfully"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating ride")
    }
});

const updateRideStatus = asyncHandler(async (req, res) => {
    try{
        const {rideId, rideStatus} = req.body;

        if(!rideId || !rideStatus) throw new ApiError(400, "Ride ID and status are required");

        const riderId = req.user._id;
        if(!riderId) throw new ApiError(400, "Unauthorized request");

        const ride = await Ride.findById(rideId);
        if(!ride) throw new ApiError(404, "Ride not found");

        const rideCharge = ride.charge;

        const updateRide = await Ride.findByIdAndUpdate(
            rideId,
            {
                status: rideStatus
            },
            {
                new:true
            }
        );

        if(rideStatus === "completed"){
            const rider = await Rider.findById(riderId);
            rider.totalEarning += rideCharge;
            rider.totalRides += 1;
            await rider.save({validateBeforeSave: false});

            const user = await User.findById(ride.userId);
            user.totalSpending += rideCharge;
            user.totalRides += 1;
            await user.save({validateBeforeSave: false});
        }

        return res.status(200).json(new ApiResponse(200, updateRide, "Ride status updated successfully"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating ride status")
    }
});

const getAllRides = asyncHandler(async (req,res) =>{
    try{
        const rides = await Ride.find({driverId:req.user._id});

        return res.status(200).json(new ApiResponse(200, rides, "Rides fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching rides")
    }
});

const getCurrentRide = asyncHandler(async (req, res) => {
    try {
        const currentRide = await Ride.findOne({
            driverId: req.user._id,
            status: "Processing"
        });

        return res.status(200).json(new ApiResponse(200, currentRide, "Current ride fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching current ride")
    }
});

const getRiderByPhoneNumber = asyncHandler(async (req, res) => {
    try {
      const rider = await Rider.findOne({ phoneNumber: req.query.phoneNumber }).select("-password -refreshToken");
      if (rider) {
        return res.status(200).json({ success: true, message: "Rider found" });
      } else {
        return res.status(200).json({ success: false, message: "Rider not found" });
      }
    } catch (error) {
      throw new ApiError(500, "Something went wrong while fetching rider details");
    }
});

const changeUserGenderPreference = asyncHandler(async (req, res) => {
    try {
        const rider = await Rider.findById(req.user._id);
        rider.userGenderPreference = req.body.preference;
        await rider.save();
        return res.status(200).json(new ApiResponse(200, "User gender preference updated successfully"));
    } catch (error){
        throw new ApiError(500, "Something went wrong while updating")
    }
})

const hello = asyncHandler(
    async (req, res) => {
        return res.status(200).json(
            new ApiResponse(200, null,"Hello rider")
        )
    }
)




export { 
    sendOtp,
    verifyOtp,
    signup,
    login,
    logout,
    refreshAccessToken,
    getCurrentRider,
    updateRiderStatus,
    getRidersByID,
    createNewRide,
    updateRideStatus,
    getAllRides,
    getCurrentRide,
    getRiderByPhoneNumber,
    changeUserGenderPreference,
    hello
}


//signup
//login
//logout

//currentRider
//toggle Availability status
//accept/Reject ride
//view earnings
//receive payments