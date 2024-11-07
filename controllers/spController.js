import Service from "../models/serviceModel.js";

export const getSp = async (req, res) => {
  const { service, coords } = req.body;
  try {
    const nearbyProviders = await Service.find({
      location: {
        $geoWithin: {
          $centerSphere: [[coords.longitude, coords.latitude], 10 / 6378.1], // Radius in radians (10 km / Earth's radius)
        },
      },
      serviceType: service,
    });
    return res.status(200).json({ sp: nearbyProviders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
