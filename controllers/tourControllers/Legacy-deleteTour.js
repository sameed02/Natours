const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("../../utils/appError");

async function deleteTour(req, res, next) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      message: "tour successfully deleted",
    });
  } catch (error) {
    next(new AppError("invalid id", 404));
  }
}

module.exports = { deleteTour };
