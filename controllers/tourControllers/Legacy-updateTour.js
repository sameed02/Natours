const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("../../utils/appError");

async function updateTour(req, res, next) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    next(new AppError("invalid id", 404));
  }
}

module.exports = { updateTour };
