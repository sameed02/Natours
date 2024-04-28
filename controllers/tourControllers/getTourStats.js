const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("./../../utils/appError");

async function getTourStats(req, res, next) {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.4 } } },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }
}

module.exports = { getTourStats };
