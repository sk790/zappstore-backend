import Service from "../models/serviceModel.js";
import User from "../models/userModel.js";

export const addService = async (req, res) => {
  const { provider, serviceType, description, available } = req.body;
  if (!provider || !serviceType || !description || !available) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const service = await Service.create({
      provider,
      serviceType,
      description,
      available,
    });
    await User.findByIdAndUpdate(provider, {
      $set: { service: service._id },
    });
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
