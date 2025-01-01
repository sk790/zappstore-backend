import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceName: { type: String, required: true },
    category: {
      type: String,
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

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      "electrician",
      "plumber",
      "carpenter",
      "painter",
      "cleaner",
      "machanic",
    ],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
export const Category = new mongoose.model("Category", categorySchema);
const Service = new mongoose.model("Service", serviceSchema);
export default Service;
