const { readFileData } = require("../../file");

function getAllTours(req, res) {
  const PATH = "./dev-data/data/tours-simple.json";
  try {
    const tours = readFileData(PATH);
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: { tours: tours },
    });
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: "Error reading file or parsing JSON",
    });
  }
}

module.exports = { getAllTours };
