import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: {
      type: String,
      enum: [
        "Electrician",
        "Plumber",
        "Carpenter",
        "Painter",
        "AC Repairing",
        "CCTV Repairing",
        "Water Purifier Repairing",
        "Geyser Repairing",
        "AC Service",
        "CCTV Service",
        "Water Purifier Service",
        "Geyser Service",
        "Painting",
        "Plumbing",
        "Carpentry",
        "Electrical",
        "Other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Service = new mongoose.model("Service",serviceSchema)
export default Service;
