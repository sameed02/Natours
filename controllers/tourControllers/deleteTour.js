const { readFileData, writeFileData } = require("../../file");

function deleteTour(req, res) {
  const id = req.params.id;
  const PATH = "./dev-data/data/tours-simple.json";

  const tours = readFileData(PATH);

  const deletedTour = tours.filter((tour) => tour.id === Number(id));
  const updatedTour = tours.filter((tour) => tour.id !== Number(id));

  writeFileData(res, PATH, updatedTour, {
    statusCode: 201,
    status: "success",
    responseData: deletedTour,
  });
}

module.exports = { deleteTour };
