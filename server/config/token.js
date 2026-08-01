import jwt from "jsonwebtoken";

// ==========================================
// GENERATE JWT TOKEN
// ==========================================
const generateToken = (userId) => {
  try {
    const token = jwt.sign(
      {
        id: userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return token;

  } catch (err) {
    console.log("JWT Error:", err);

    return null;
  }
};

export default generateToken;