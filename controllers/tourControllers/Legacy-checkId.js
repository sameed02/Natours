const { readFileData } = require("../../file");

function checkId(req, res, next, id) {
  const PATH = "./dev-data/data/tours-simple.json";
  const tours = readFileData(PATH);
  try {
    const foundTour = tours.filter((tour) => tour.id === Number(id));
    if (foundTour.length > 0) {
      next();
    } else {
      const err = { status: "fail", message: "invalid id" };
      throw err;
    }
  } catch (error) {
    return res.status(404).json({
      status: error.status,
      message: error.message,
    });
  }
}

module.exports = { checkId };
