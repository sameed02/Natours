const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("../../utils/appError");

async function getToursWithin(req, res, next) {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    // converting radius of sphere to be radian and in order to calc radiant we divide out distance by radius of eartch which is different in mi and different in km
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
      throw new AppError(
        "provide latitude and lognitude in format lat,lng",
        400
      );
    }
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    console.log({ distance, lat, lng, unit });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

module.exports = { getToursWithin };
