import { ApiError } from "../utils/index.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.redirect("/login");
      // throw new ApiError(401, "Login required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    // throw new ApiError(401, "Invalid or expired token");
  }
};

export default isLoggedIn;
