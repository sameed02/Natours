const { APIFeatures } = require("../../utils/apiFeatures");
const { AppError } = require("../../utils/appError");

function getAll(Model) {
  return async function getAllTours(req, res, next) {
    try {
      // executing query and sending response
      const DocApiFeatures = new APIFeatures(Model, req.query)
        .filter()
        .sort()
        .fields();
      await DocApiFeatures.pagination();

      const doc = await DocApiFeatures.query;

      res.status(200).json({
        status: "success",
        result: doc.length,
        data: { doc },
      });
    } catch (err) {
      next(new AppError(err.message, 404));
    }
  };
}

// only for nested route /:tourId/reviews THIS WILL DO {_id: "id of tour"}
function setTourId(req, res, next) {
  if (req.params.tourId) req.query._id = req.params.tourId;
  next();
}

module.exports = { getAll, setTourId };
