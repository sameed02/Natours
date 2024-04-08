const { Tour } = require("./../../models/tourModels/tourSchema");

async function updateTour(req, res) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
}

module.exports = { updateTour };
