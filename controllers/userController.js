import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check if user already exists
    const duplicate = await User.findOne({ phone });

    if (duplicate) {
      return res.status(400).json({ message: "mobile already exists" });
    }
    // Generate JWT token
    const user = await User.create({ phone, password });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .cookie("zapp_access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        message: "User created successfully",
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .cookie("zapp_access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        message: "User logged in successfully",
        token,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, password, mobile, address } = req.body;
  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.password = password || user.password;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("service")
      .select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  const { coords, mobile } = req.body;
  if (!coords) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "user") {
      user.location = coords;
    }
    if (user.role === "sp" && !user.location) {
      user.location = coords;
    }
    await user.save();
    res.status(200).json({ message: "Location updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
