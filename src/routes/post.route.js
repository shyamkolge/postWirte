import Router from "express";
import {
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAllPosts,
} from "../controller/post.controller.js";

const router = Router();

router
  .get("/all", getAllPosts)
  .get("/:id", getPostById)
  .post("/create", createPost)
  .post("/edit/:postId", updatePost)
  .get("/like/:postId", likePost)
  .get("/delete/:postId", deletePost);

export default router;
