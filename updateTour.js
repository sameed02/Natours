const { readFileData, writeFileData } = require("./file");

function updateTour(req, res) {
  const PATH = "./dev-data/data/tours-simple.json";
  try {
    // reading file
    const tours = readFileData(PATH);

    // filtering out requested tour
    const foundTour = tours.filter((tour) => tour.id === Number(req.params.id));

    // if tour is found write update tour
    if (foundTour.length > 0) {
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
    } else {
      const error = { status: "fail", message: "Tour wasn't found" };
      throw error;
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
}

module.exports = { updateTour };
