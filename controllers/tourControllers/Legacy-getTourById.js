const { Tour } = require("../../models/tourModels/tourModel");
const { AppError } = require("../../utils/appError");

async function getTourById(req, res, next) {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate("reviews");
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    next(new AppError(`no tour was found of id ${id} `, 404));
  }
}

module.exports = { getTourById };
