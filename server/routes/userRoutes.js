import express from "express";
import { getAllUsers, login, logout, register, uploadProfile } from "../controller/userController.js";
import { verifyToken } from "../utils/middleware.js";
import { upload } from "../utils/cloudinary.js";  // 👈 upload instance import

const router = express.Router();

// Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/users").get(verifyToken, getAllUsers);

// Upload profile pic route — multer middleware use
router.route("/upload").post(verifyToken, upload.single("profile"), uploadProfile);

export default router;
 