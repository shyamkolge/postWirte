import Router from "express";
import {
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controller/post.controller.js";

const router = Router();

router
  .get("/:id", getPostById)
  .post("/create", createPost)
  .post("/edit/:postId", updatePost)
  .get("/like/:postId", likePost)
  .get("/delete/:postId", deletePost);

export default router;
