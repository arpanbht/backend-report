import expressAsyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/response.util.js";

export const handleHealthCheck = expressAsyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Server health-check successful");
});
