const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("../../utils/appError");

async function getDistances(req, res, next) {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      throw new AppError(
        "provide latitude and lognitude in format lat,lng",
        400
      );
    }
    // geoNear is the only geo aggregation pipeline stage and it always has to be the first stage and it also have to have one geoSpatial index
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          name: 1,
          distance: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: distances.length,
      data: { distances },
    });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { getDistances };
