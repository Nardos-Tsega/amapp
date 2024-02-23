import express from "express";
import userRoutes from "../routes/user";
import { Routes } from "../utils/constants";

const router = express.Router();

router.use(Routes.USER, userRoutes);

export default router;
