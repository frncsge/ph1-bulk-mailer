import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/token.utils.js";
import { userSession } from "../utils/session.utils.js";

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check email
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password is required" });

    if (email !== process.env.EMAIL)
      return res.status(401).json({ message: "Incorrect email or password" });

    // check password
    const match = await bcrypt.compare(password, process.env.HASHED_PASSWORD);

    if (!match)
      return res.status(401).json({ message: "Incorrect email or password" });

    // create session
    const accessToken = generateAccessToken({ email });
    userSession.create(res, accessToken);

    res.status(200).json({ message: "Log in successful" });
  } catch (error) {
    console.error("Error while loggin in", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to log you in",
    });
  }
};

export const logOut = (req, res) => {
  try {
    userSession.terminate(res);
    res.status(200).json({ message: "Log out successful" });
  } catch (error) {
    console.error("Error while loggin in", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to log you in",
    });
  }
};
