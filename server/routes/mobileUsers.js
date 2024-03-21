import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  deleteUser,
  getUsers
} from "../controllers/users.js";
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/",  getUsers);
// router.get("/:id", verifyToken, getUser);
router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

//delete
router.delete("/:id", deleteUser);

export default router;