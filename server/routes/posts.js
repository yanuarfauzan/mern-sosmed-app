import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// menampilkan semua postingan di homepage
router.get("/", verifyToken, getFeedPosts);
// semua postingan satu user
router.get("/:userId/posts", verifyToken, getUserPosts);
// like dan dislike postingan
router.patch("/:id/like", verifyToken, likePost);

export default router;