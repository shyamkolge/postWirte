import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponce } from "../utils/index.js";

// const getAllPosts = asyncHandler(async (req, res) => {
//   const posts = await postModel.find({ user: req.user._id });

//   if (!posts.length > 0) {
//     throw new ApiError(404, "No posts found");
//   }

//   res
//     .status(201)
//     .json(new ApiResponce(200, posts, "Posts Fetched Successfully"));
// });

const getPostById = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const posts = await postModel.findOne({ user: userId });

  res.send(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const content = req.body?.content;
  const loginUser = await userModel.findById(req.user._id);

  if (!content) {
    throw new ApiError(400, "Post content is required");
  }

  const post = await postModel.create({
    user: loginUser._id,
    content,
  });

  if (!post)
    throw new ApiError(500, "Something went wrong while creating an post");

  loginUser.posts.push(post._id);
  await loginUser.save({ validateBeforeSave: false });

  res.status(201).redirect("/profile");
  // .json(new ApiResponce(200, post, "post created Successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const updateId = req.params?.postId;

  const updatedContent = req.body?.content;

  const updatedPost = await postModel.findByIdAndUpdate(updateId, {
    content: updatedContent,
  });

  res.redirect("/profile");
});

const deletePost = asyncHandler(async (req, res) => {
  await postModel.findByIdAndDelete(req.params.postId);
  res.redirect("/profile");
});

const likePost = asyncHandler(async (req, res) => {
  const postId = req.params?.postId;
  const referrer = req.get("Referer");

  // const user = await userModel.findById(req.user._id);
  const post = await postModel.findById(postId);

  if (post.likes.indexOf(req.user._id) == -1) {
    post.likes.push(req.user._id);
  } else {
    post.likes.splice(post.likes.indexOf(req.user._id), 1);
  }
  await post.save();
  res.status(200).redirect(referrer);
});

export { getPostById, createPost, updatePost, deletePost, likePost };
