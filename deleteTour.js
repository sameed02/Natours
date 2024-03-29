const { readFileData, writeFileData } = require("./file");

function deleteTour(req, res) {
  const id = req.params.id;
  const PATH = "./dev-data/data/tours-simple.json";
  try {
    const tours = readFileData(PATH);
    const deletedTour = tours.filter((tour) => tour.id === Number(id));
    const updatedTour = tours.filter((tour) => tour.id !== Number(id));
    console.log(tours.length);

    writeFileData(res, PATH, updatedTour, {
      statusCode: 201,
      status: "success",
      responseData: deletedTour,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
}

module.exports = { deleteTour };
