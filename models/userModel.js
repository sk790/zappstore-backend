import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    mobile: {
      type: String,
      unique: true,
      require: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "sp"],
      required: true,
    },
    address: {
      type: String,
    },
    profile: {
      type: String,
    },
    serviceResolved: {
      type: Number,
      default: 0,
    },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    bookedServices: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
