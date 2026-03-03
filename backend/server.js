import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api", emailRoutes);

//default, for checking only
app.get("/", (req, res) => {
  res.send("Bulk-mailer API is running");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
