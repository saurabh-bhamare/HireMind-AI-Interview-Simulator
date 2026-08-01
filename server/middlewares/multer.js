import jwt from "jsonwebtoken";

// ==========================================
// AUTH MIDDLEWARE
// ==========================================
const isAuthenticated = (req, res, next) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    // Check Authorization Header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save User ID
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

export default isAuthenticated;
