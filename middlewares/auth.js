import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  // Get token from "Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({
        message: "you must be login and give token in header with barrer",
      });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user info to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const ensureAuthentication = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "you must need to  be login " });
  }
  next();
};
