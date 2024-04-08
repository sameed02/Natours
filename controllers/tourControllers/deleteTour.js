const { Tour } = require("./../../models/tourModels/tourSchema");

async function deleteTour(req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      message: "tour successfully deleted",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
}

module.exports = { deleteTour };
