import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  otpExpiresAt: {
    type: Date,
    createdAt: Date.now(),
  },
});

const TempUser = new mongoose.model("TempUser", tempUserSchema);
export default TempUser;
