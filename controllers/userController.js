import User from "../models/userModel.js";

export const signup = async (req, res) => {
  const { mobile, password, role } = req.body;
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
    const user = await User.create({ mobile, password, role });
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
  const { name, email, password, mobile } = req.body;
  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
