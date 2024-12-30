import Service from "../models/serviceModel.js";
import haversineDistance from "../utils/getDistance.js";

export const getSpByCategoryAndDiastance = async (req, res) => {
  const { category, location: userLocation, areaRange } = req.body;

  try {
    const spFilterdByCategory = await Service.find({ category })
      .populate("provider")
      .limit(10);
    if (!spFilterdByCategory) {
      return res.status(404).json({ message: "Service not found" });
    }

    const distances = [];
    if (spFilterdByCategory.length === 0) {
      return res.status(404).json({ message: "No service found" });
    }
    const filterByDistanceandService = spFilterdByCategory.filter((sp) => {
      const distance = haversineDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: sp.location.lat, longitude: sp.location.long }
      );
      distances.push(distance.toFixed(2)); // Push distance to the distances array
      if (distance <= areaRange) {
        return { ...spFilterdByCategory, distance };
      }
    });
    res.status(200).json({
      message: "SP fetched successfully",
      filterByDistanceandService,
      distances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpBySearch = async (req, res) => {
  const { searchQuery, location: userLocation, areaRange } = req.body;

  if (!searchQuery || searchQuery.trim() === "") {
    console.log("Search query is required.");
    return res
      .status(400)
      .json({ message: "Search query is required.", sp: [] });
  }
  try {
    const query = { category: { $regex: `${searchQuery}`, $options: "i" } }; // Matches category

    const sp = await Service.find(query).populate("provider");

    if (sp.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching services found by search." });
    }
    const distances = [];
    console.log({ sp });

    const filterByDistanceand = sp.filter((sps) => {
      const distance = haversineDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: sps.location.lat, longitude: sps.location.long }
      );
      distances.push(distance.toFixed(2)); // Push distance to the distances array
      if (distance <= areaRange) {
        return { ...sp, distance };
      }
    });
    console.log({ filterByDistanceand });

    if (distances.length === 0) {
      return res.status(404).json({
        message: "No matching services found by search and after distance.",
      });
    }

    const sortedSp = filterByDistanceand.sort((a, b) => {
      const aStartsWithSearch = a.serviceName
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());
      const bStartsWithSearch = b.serviceName
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());

      if (aStartsWithSearch && !bStartsWithSearch) {
        return -1; // 'a' should come first
      }
      if (!aStartsWithSearch && bStartsWithSearch) {
        return 1; // 'b' should come first
      }
      return a.serviceName.localeCompare(b.serviceName); // Alphabetical sorting if both match
    });

    res.status(200).json({
      message: "SP fetched successfully",
      sp: sortedSp,
      distances,
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
