const { readFileData } = require("../../file");

function getTourById(req, res) {
  const PATH = "./dev-data/data/tours-simple.json";

  const tour = readFileData(PATH);
  const foundTour = tour.filter((tour) => tour.id === Number(req.params.id));

  res.status(200).json({
    status: "success",
    data: { tour: foundTour },
  });
}

module.exports = { getTourById };
