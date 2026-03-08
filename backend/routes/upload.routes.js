import express from "express";
import upload from "../config/multer.config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { uploadCsv } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload/csv", authenticateUser, upload.single("csv"), uploadCsv);

export default router;
