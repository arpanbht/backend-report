import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
// import { sendError } from "../utils/response.util.js";

const verifyJWT = expressAsyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });

    const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedInfo?._id).select(
      "-password -refreshToken"
    );

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || "Unauthorized request",
    });
  }
});

export { verifyJWT };
