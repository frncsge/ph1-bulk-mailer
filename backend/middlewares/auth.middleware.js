import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const { access_token } = req.cookies;

  try {
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { email: decoded.email };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Log in is required" });
  }
};
