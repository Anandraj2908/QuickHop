import { Router } from "express";

import {
    hello,
    login,
    sendOtp,
    signup,
    verifyOtp,
    logout,
    currentUser,
    getAllRides,
    refreshAccessToken,
    getUserById,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sendotp").post(sendOtp);
router.route("/verifyotp").post(verifyOtp);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);
router.route("/refresh-access-token").post(verifyJWT,refreshAccessToken);
router.route("/get-current-user").get(verifyJWT,currentUser);
router.route("/get-all-rides").get(verifyJWT,getAllRides);
router.route("/get-user-by-id/:id").get(getUserById);
router.route("/hello").get(hello);

export default router;