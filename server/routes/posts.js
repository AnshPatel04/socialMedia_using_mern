import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost, patchComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/",  getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
// router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id",  verifyToken, patchComment);

// deletePost
router.delete("/:id", verifyToken, deletePost);
export default router;