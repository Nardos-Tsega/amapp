import express from "express";
import {
  createUserController,
  loginUser,
  refreshToken,
} from "../controllers/users.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/user.validator.js";

const router = express.Router();

router.post("/account", registerValidator, createUserController);
router.post("/login", loginValidator, loginUser);
router.get("/refresh", refreshToken);

export default router;
