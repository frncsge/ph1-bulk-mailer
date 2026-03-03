export const userSession = {
  create: (res, accessToken) => {
    // send cookie containing the access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000,
    });
  },

  terminate: (res) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  },
};
