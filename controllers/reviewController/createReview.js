const { AppError } = require("./../../utils/appError");
const { Review } = require("../../models/reviewModels/reviewModel");

async function createReview(req, res, next) {
  try {
    const newReview = await Review.create({ ...req.body });
    res.status(201).json({
      status: "success",
      data: { review: newReview },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
}

module.exports = { createReview };
