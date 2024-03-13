import express from "express";
import {
  createUserController,
  loginUser,
  refreshToken,
  getAllUsers,
  getUser,
  deleteUser,
  editUser,
} from "../controllers/users.js";
import {
  registerValidator,
  loginValidator,
  paramIdValidator,
} from "../validators/user.validator.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/account",
  upload.single("profileImage"),
  registerValidator,
  createUserController
);
router.post("/login", loginValidator, loginUser);
router.get("/refresh", refreshToken);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", editUser);

export default router;
