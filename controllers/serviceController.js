import Service from "../models/serviceModel.js";
import User from "../models/userModel.js";

export const addService = async (req, res) => {
  const { category, description, address, serviceName, location } = req.body;
  console.log(location);

  if (!category || !description || !address || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const service = await Service.create({
      provider: user._id,
      category,
      serviceName,
      description,
      address,
      location,
    });
    if (service) {
      await User.findByIdAndUpdate(user._id, {
        $set: { service: service._id },
        $set: { role: "sp" },
      });
    }
    res.status(200).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
