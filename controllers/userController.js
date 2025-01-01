import TempUser from "../models/tempUserModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { configDotenv } from "dotenv";
configDotenv();

const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const twilioPhoneNo = process.env.twilioPhoneNo;
const client = twilio(accountSID, authToken);

export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  console.log(phone);

  if (!phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistTempUser = await TempUser.findOne({ phone });
    if (isExistTempUser) {
      return res.status(400).json({
        message: "Your have already sent otp please try after some time.",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    await client.messages.create({
      body: `Hi, your OTP is ${otp}`,
      from: twilioPhoneNo,
      to: "+91" + phone,
    });
    const tempUser = await TempUser.create({
      phone,
      otp,
      otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });
    setTimeout(async () => {
      try {
        const stillExists = await TempUser.findOne(tempUser._id);

        if (stillExists) {
          // Delete the unverified temporary user
          await TempUser.findByIdAndDelete(tempUser._id);
          console.log(
            `Temporary user ${tempUser._id} deleted due to inactivity.`
          );
        }
      } catch (error) {
        console.error("Error deleting temporary user:", error);
      }
    }, 1 * 60 * 1000);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyOtp = async (req, res) => {
  const { phone, password, otp } = req.body;
  if (!phone || !otp || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const tempUser = await TempUser.findOne({ phone });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid phone number or OTP" });
    }
    if (Number(otp) !== tempUser.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const user = await User.create({ phone, password });
    await TempUser.findByIdAndDelete(tempUser._id);
    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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
    const isExistTempUser = await TempUser.findOne({ phone });
    if (isExistTempUser) {
      return res.status(400).json({
        message: "Your have already sent otp please try after some time.",
      });
    }
    const tempUser = await TempUser.create({ phone });
    const otp = Math.floor(100000 + Math.random() * 900000);
    await TempUser.findByIdAndUpdate(tempUser.id, { otp });
    res.status(200).json({ message: "OTP sent successfully" });

    // const user = await User.create({ phone, password });
    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    const token = "bubjb";
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
        // user,
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
