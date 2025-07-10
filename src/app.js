import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import isLoggedIn from "./middleware/isLoggedIn.js";
import userModel from "./models/user.model.js";
import postRoutes from "./routes/post.route.js";
import postModel from "./models/post.model.js";
import authCheck from "./middleware/authCheck.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home");
});

// Posts page
app.get("/posts", isLoggedIn, async (req, res) => {
  const posts = await postModel.find({}).populate("user");

  res.render("posts", { posts, user: req.user });
});

// EJS Routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Post routes
app.use("/api/v1/posts", isLoggedIn, postRoutes);

// Protected Routes
app.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("-password -refreshToken");
  await user.populate("posts");
  res.render("profile", { user });
});

app.get(
  "/post/edit/:postId",
  isLoggedIn,
  authCheck("admin"),
  async (req, res) => {
    const post = await postModel.findById(req.params.postId);

    res.render("editPost", { post });
  }
);

export default app;
