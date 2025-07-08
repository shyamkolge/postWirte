import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce, ApiError } from "../utils/index.js";
import UserModel from "../models/user.model.js";
import userModel from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || name.trim() == "") {
    throw new ApiError(400, "name is required..!");
  }

  if (!username || username.trim() == "") {
    throw new ApiError(400, "username is required ");
  }

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "enter valid email");
  }

  if (!password || password.length < 6) {
    throw res.status(400).send("Password must be at least 6 characters long.");
  }

  const existingUser = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(400, "Email or Username is already exists");
  }

  const profileImage = await uploadOnCloudinary(req.file?.path || "");

  // if (!profileImage?.secure_url) {
  //   throw new ApiError(
  //     500,
  //     "Something went wrong while uploading profile image"
  //   );
  // }

  const user = await UserModel.create({
    name,
    profilePhoto: profileImage?.secure_url,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  const userCreated = await UserModel.findById(user._id).select("-password");

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while creating a user ");
  }

  const accessToken = await userCreated.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
  return res.cookie("accessToken", accessToken, options).redirect("/profile");
  // .json(new ApiResponce(200, userCreated, "User created successfully"))
});

// ## User login
const loginUser = asyncHandler(async (req, res, next) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "Email is required");
  }

  const existedUser = await userModel.findOne({ email });

  if (!existedUser) {
    throw new ApiError(404, "User does not exists");
  }

  const valid = await existedUser.isPasswordCorrect(password);

  if (!valid) {
    throw new ApiError("Email or password is wrong ");
  }

  const accessToken = await existedUser.generateAccessToken();

  const logedInUser = await userModel
    .findById(existedUser._id)
    .select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .redirect("/profile");
  // .json(new ApiResponce(200, logedInUser, "Logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken").redirect("/profile");
});

const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Refresh token not found or revoked");
  }

  try {
    const { _id } = jwt.verify(token, process.env.REFRESH_SECRET);
    console.log(id);

    const newAccessToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Optionally rotate refresh token
    // const newRefreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    // refreshTokens = refreshTokens.filter(rt => rt !== token);
    // refreshTokens.push(newRefreshToken);
    // res.cookie('refreshToken', newRefreshToken, { /* same options */ });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

export { registerUser, loginUser, logoutUser };
