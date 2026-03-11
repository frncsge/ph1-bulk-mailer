import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import nodeCron from "node-cron";
import https from "https";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api", emailRoutes);
app.use("/api", uploadRoutes);

// default, for checking only
app.get("/", (req, res) => {
  res.send("Bulk-mailer API is running");
});

// Ping the server every 14 minutes to prevent it from sleeping on Render (free tier)
nodeCron.schedule("*/14 * * * *", () => {
  https
    .get("https://ph1-bulk-mailer.onrender.com/", (res) => {
      console.log(
        `Server pinged at ${new Date().toLocaleTimeString()}! Response tatus: ${res.statusCode}`,
      );
    })
    .on("error", (error) => {
      console.error(
        "An error occured while trying to ping the server:",
        error.message,
      );
    });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
