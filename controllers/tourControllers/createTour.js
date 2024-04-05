const { readFileData, writeFileData } = require("../../file");
const { Tour, saveTour } = require("./../../modals/tourModals/tourSchema");

function createTour(req, res) {
  /* const PATH = "./dev-data/data/tours-simple.json";
  const tours = readFileData(PATH);

  // getting last tour id
  const newId = tours[tours.length - 1].id + 1;
  // creatin new tour
  const newTour = { id: newId, ...req.body };
  // adding newTour in tours array
  tours.push(newTour);

  // update tours in file
  writeFileData(res, PATH, tours, {
    statusCode: 201,
    status: "success",
    responseData: newTour,
  }); */

  const createNewTour = new Tour({ ...req.body });
  saveTour(res, createNewTour);
}

module.exports = { createTour };
