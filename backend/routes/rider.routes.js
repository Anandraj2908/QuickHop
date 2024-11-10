import { Router } from "express";

import {
    hello,
    login,
    sendOtp,
    signup,
    verifyOtp,
    logout,
    getCurrentRider,
    updateRiderStatus,
    getRidersByID,
    updateRideStatus,
    getAllRides,
    refreshAccessToken,
    createNewRide,
    getCurrentRide,
} from "../controllers/rider.controller.js";

import { verifyJWT } from "../middlewares/riderAuth.middleware.js";
import { verifyJWT as userVerifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/sendotp").post(sendOtp);
router.route("/verifyotp").post(verifyOtp);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);
router.route("/get-current-rider").get(verifyJWT,getCurrentRider);
router.route("/update-rider-status").patch(verifyJWT,updateRiderStatus);
router.route("/get-riders-by-id").post(getRidersByID);
router.route("/create-new-ride").post(verifyJWT,createNewRide);
router.route("/update-ride-status").patch(verifyJWT,updateRideStatus);
router.route("/get-all-rides").get(verifyJWT,getAllRides);
router.route("/get-current-ride").get(verifyJWT,getCurrentRide);
router.route("/refresh-access-token").get(verifyJWT,refreshAccessToken);
router.route("/hello").get(hello);

export default router;