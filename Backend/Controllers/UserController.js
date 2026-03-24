import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashPassword,comparePassword } from "../Helpers/AuthHelper.js";

// ================= HELPER =================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
console.log("inside backend",name,email,password);
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        token: generateToken(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token: generateToken(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= GET PROFILE =================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or email) is required",
      });
    }

    // Check email uniqueness
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= GET ALL USERS (ADMIN) =================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};