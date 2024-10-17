import { User } from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
import { sendError, sendSuccess } from "../utils/response.util.js";
import { generateToken } from "../utils/generateToken.util.js";
import Mail from "../utils/sendMail.util.js";
import generateOTP from "../utils/generateOTP.js";
import { transporter } from "../config/nodemailer.config.js";
import { OTP } from "../models/otp.model.js";

export const handleUserRegistration = expressAsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    sendError(res, 400, "All fields are required");
  }

  if (!email.includes("@")) return sendError(res, 400, "Invalid email format");

  const existingUser = await User.findOne({ email });

  if (existingUser) return sendError(res, 400, "User already exists");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  console.log(user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    return sendError(500, res, "Something went wrong during user registration");

  return sendSuccess(res, 201, createdUser, "User succesfully created");
});

export const handleUserLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) return sendError(400, res, "Email is required");

  const existingUser = await User.findOne({ email });
  if (!existingUser) return sendError(404, res, "Used is not registered");

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) return sendError(res, 401, "Invalid password");

  const { accessToken, refreshToken } = await generateToken(existingUser._id);

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  //   return sendSuccess(
  //     200,
  //     res.set("Authorization", `Bearer ${accessToken}`),
  //     {
  //       user: loggedInUser,
  //       accessToken: accessToken,
  //       refreshToken: refreshToken,
  //     },
  //     "User logged in successfully"
  //   );

  return res.status(200).set("Authorization", `Bearer ${accessToken}`).json({
    user: loggedInUser,
    message: "User logged in successfully",
  });
});

export const handleGetVerificationOTP = expressAsyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const otp = generateOTP();

    const mailOptions = new Mail(
      email,
      "Hello from Arpan Bhattacharya",
      `Use this otp to verify your email address: ${otp}`
    );

    const newOTP = await OTP.create({
      otp,
    });

    const info = await transporter.sendMail(mailOptions);

    console.log(newOTP);
    console.log(info.messageId);

    return res.status(200).json(
      {
        success: true,
        message: info.messageId,
      },
      "OTP send successfully"
    );
  }
);

export const handleVerifyOTP = expressAsyncHandler(async (req, res) => {
  const { otp } = req.body;

  const existingOTP = await OTP.findOne({ otp });

  if (!existingOTP)
    return res.status(401).json({
      success: false,
      message: "Wrong OTP entered",
    });

  return res.status(200).json({
    success: true,
    message: "Verified successfully",
  });
});

export const handleUserUpdatePassword = expressAsyncHandler(
  async (req, res) => {
    const { oldPassword, newPassword, confPassword } = req.body;

    if (!(newPassword === confPassword))
      throw new ApiError(400, "Password doesn't match");

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect)
      res.status(400).json({
        success: false,
        message: "Invalid old password",
      });

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);

export const handleUserForgetPassword = expressAsyncHandler(
  async (req, res) => {
    const { email, newPassword, confPassword } = req.body;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "No user found",
      });

    if (!(newPassword === confPassword))
      return res.status(400).json({
        success: false,
        message: "Password doesn't match",
      });

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
