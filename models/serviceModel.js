import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceName: { type: String, required: true },
    category: {
      type: String,
      enum: ["electrician", "plumber", "carpenter", "painter"],
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    address: { type: String, required: true },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Service = new mongoose.model("Service", serviceSchema);
export default Service;
