function checkBody(req, res, next) {
  const tour = req.body;

  if (tour.hasOwnProperty("name") && tour.hasOwnProperty("price")) {
    next();
  } else {
    return res.status(400).json({ staus: "fail", message: "bad request" });
  }
}

module.exports = { checkBody };
