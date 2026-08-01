import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =======================
// SIGNUP
// =======================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// =======================
// GOOGLE AUTH
// =======================
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(
        email + process.env.JWT_SECRET,
        10
      );

      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Google Authentication Failed",
    });
  }
};

// =======================
// LOGOUT
// =======================
export const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};  