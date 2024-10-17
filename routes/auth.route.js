import { Router } from "express";
import {
  handleUserLogin,
  handleUserRegistration,
  handleGetVerificationOTP,
  handleVerifyOTP,
  handleUserForgetPassword,
  handleUserUpdatePassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(handleUserRegistration);

router.route("/login").post(handleUserLogin);

router.route("/send-email").get(handleGetVerificationOTP);

router.route("/verify-otp").post(handleVerifyOTP);

router.route("/update-password").post(verifyJWT, handleUserUpdatePassword);

router.route("/forget-password").post(handleUserForgetPassword);

export default router;
