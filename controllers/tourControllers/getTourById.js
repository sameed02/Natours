const { Tour } = require("./../../models/tourModels/tourSchema");

async function getTourById(req, res) {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: "invalid id",
    });
  }
}

module.exports = { getTourById };
