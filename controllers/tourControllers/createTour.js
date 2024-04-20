const { Tour } = require("./../../models/tourModels/tourSchema");

async function createTour(req, res) {
  try {
    const newTour = await Tour.create({ ...req.body });
    res.status(201).json({
      status: "success",
      data: newTour,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message || "invalid data sent",
    });
  }
}

module.exports = { createTour };
