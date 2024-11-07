import User from "../models/userModel.js";

export const signup = async (req, res) => {
  const { mobile, password, role, address } = req.body;
  console.log(req.body);

  if (!mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user already exists
  const duplicate = await User.findOne({ mobile });

  if (duplicate) {
    return res.status(400).json({ message: "mobile already exists" });
  }

  try {
    const user = await User.create({ mobile, password, role, address });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", user });
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
  const { mobile } = req.body;
  try {
    const user = await User.findOne({ mobile }).populate("service");
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
    if (!user.location) {
      user.location = coords;
    }
    await user.save();
    res.status(200).json({ message: "Location updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
