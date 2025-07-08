import { ApiError } from "../utils/index.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js";

// Middleware for the protected routes
const isLoggedIn = asyncHandler(async (req, res, next) => {
  // 1) get the token and check if it exists
  const token = req.cookies?.accessToken;

  //if (!token) return next(new ApiError(401, "You are not logged in"));
  if (!token) return res.redirect("/login");

  try {
    // 2) check if the token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const freshUser = await userModel.findById(decoded._id);
    if (!freshUser)
      return next(new ApiError(401, "User not found with the token"));

    // 4) Check if user changed it's password after the token was issued
    if (freshUser.passwordChangedAfter(decoded.iat)) {
      return next(new ApiError(401, "User recently changed password"));
    }

    // Add the user details in the req object
    req.user = freshUser;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token", error));
  }
});

export default isLoggedIn;
