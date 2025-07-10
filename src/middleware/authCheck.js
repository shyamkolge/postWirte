import { ApiError } from "../utils/index.js";

const authCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have access to this resource..!")
      );
    }
    next();
  };
};

export default authCheck;
