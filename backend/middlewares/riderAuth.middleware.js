import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Rider } from "../models/rider.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new ApiError(401, "Unauthorized request: No authorization header found");
        }

        const token = authHeader.split(' ')[1]; 

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No access token provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user based on the decoded token
        const user = await Rider.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: Rider not found");
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
