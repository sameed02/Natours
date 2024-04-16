async function getTourStats(req, res, next) {
  try {
    console.log("");
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message || "Error reading file or parsing JSON",
    });
  }
}

module.exports = { getTourStats };
