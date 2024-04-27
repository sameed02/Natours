const { Tour } = require("./../../models/tourModels/tourSchema");
const { AppError } = require("./../../utils/appError");

async function createTour(req, res, next) {
  try {
    const newTour = await Tour.create({ ...req.body });
    res.status(201).json({
      status: "success",
      data: newTour,
    });
  } catch (err) {
    next(
      new AppError(
        `${err.code === 11000 ? "duplicate value" : `${err.message}`}`,
        400
      )
    );
  }
}

module.exports = { createTour };
