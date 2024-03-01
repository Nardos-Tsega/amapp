import express from "express";
import { createUserController } from "../controllers/users.js";

const router = express.Router();

router.post("/account", createUserController);

export default router;
