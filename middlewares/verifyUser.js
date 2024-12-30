import jwt from "jsonwebtoken";
export const verifyUser = (req, res, next) => {
  const token = req.cookies.zapp_access_token;
  if (!token) {
    return res
      .status(406)
      .json({ success: false, message: "Unauthorized for this user" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden invalid token" });
    }
    req.user = user;
    next();
  });
};
