const { Review } = require("./../../models/reviewModels/reviewModel");

async function getReviews(req, res, next) {
  try {
    const reviews = await Review.find({}).sort("_id");
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
