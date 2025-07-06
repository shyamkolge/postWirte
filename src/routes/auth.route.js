import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/user.controller.js";
import upload from "../middleware/fileUpload.js";

const router = Router();

router.post("/register", upload.single("profile"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
// router.get("/refresh-tonken", refreshAccessToken);

export default router;
