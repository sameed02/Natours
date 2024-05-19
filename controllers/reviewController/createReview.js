const { AppError } = require("./../../utils/appError");
const { Review } = require("../../models/reviewModels/reviewModel");

async function createReview(req, res, next) {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
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
