import express from "express";

const router = express.Router();

router.get("/account", (req, res) => {
  res.send("hello world");
});

export default router;
