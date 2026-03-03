import express from "express";
import upload from "../config/multer.config.js";
import { sendEmail } from "../controllers/email.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/email/send",
  authenticateUser,
  upload.fields([
    { name: "csv", maxCount: 1 },
    {
      name: "attachments",
      maxCount: 5,
    },
  ]),
  sendEmail,
);

export default router;
