import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "sp"],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
