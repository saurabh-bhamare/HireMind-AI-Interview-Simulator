import jwt from "jsonwebtoken";

// ==========================================
// AUTH MIDDLEWARE
// ==========================================
const isAuth = (req, res, next) => {
  try {
    // Authorization: Bearer <token>
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save logged-in user's ID
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default isAuth;