const { readFileData, writeFileData } = require("../../file");

function updateTour(req, res) {
  const PATH = "./dev-data/data/tours-simple.json";

  // reading file
  const tours = readFileData(PATH);

  // filtering out requested tour
  const foundTour = tours.filter((tour) => tour.id === Number(req.params.id));

  // getting position of foundTour from ID in tours array
  const foundTourIndex = tours.findIndex(
    (tour) => tour.id === Number(req.params.id)
  );

  // creating updated tour
  const updatedTourData = { ...foundTour[0], ...req.body };

  // updating old tour with new data at from ID
  tours[foundTourIndex] = updatedTourData;

  // writing to file
  writeFileData(res, PATH, tours, {
    statusCode: 201,
    status: "success",
    responseData: updatedTourData,
  });
}

module.exports = { updateTour };
