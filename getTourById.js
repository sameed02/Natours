const { readFileData } = require("./file");

function getTourById(req, res) {
  const PATH = "./dev-data/data/tours-simple.json";
  try {
    const tour = readFileData(PATH);
    const foundTour = tour.filter((tour) => tour.id === Number(req.params.id));

    if (foundTour.length > 0) {
      res.status(200).json({
        status: "success",
        data: { tour: foundTour },
      });
    } else {
      const error = { status: "fail", message: "no tour found" };
      throw error;
    }
  } catch (err) {
    res.status(404).json({
      status: err.status,
      message: err.message,
    });
  }
}

module.exports = { getTourById };
