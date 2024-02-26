import express from "express";
import userRoutes from "../routes/user.js";
import { Routes } from "../utils/constants.js";

const router = express.Router();

router.use(Routes.USER, userRoutes);

export default router;
