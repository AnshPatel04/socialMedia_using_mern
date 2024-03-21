import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost, patchComment } from "../controllers/posts.js";

const router = express.Router();

/* READ */
router.get("/",  getFeedPosts);
// router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);
router.patch("/:id",  patchComment);

// deletePost
router.delete("/:id", deletePost);
export default router;