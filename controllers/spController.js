import Service from "../models/serviceModel";

export const getSp = async (req, res) => {
  const { service } = req.body;
  try {
    const sp = await Service.find({ serviceType: service }).populate(
      "provider"
    );
    if (!sp) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "SP fetched successfully", sp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
