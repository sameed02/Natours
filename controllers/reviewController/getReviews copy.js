const { AppError } = require("../../utils/appError");
const { Review } = require("./../../models/reviewModels/reviewModel");

async function getReviews(req, res, next) {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  try {
    const reviews = await Review.find(filter).sort("_id");
    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
}

module.exports = { getReviews };
