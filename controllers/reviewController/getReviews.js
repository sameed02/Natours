const { APIFeatures } = require("../../utils/apiFeatures");
const { AppError } = require("../../utils/appError");

function getReviews(Model) {
  return async function reviewByTourId(req, res, next) {
    try {
      const queryObj = { ...req.query, tour: req.params.tourId };
      // executing query and sending response
      const DocApiFeatures = new APIFeatures(Model, queryObj)
        .filter()
        .sort()
        .fields();
      await DocApiFeatures.pagination();

      const doc = await DocApiFeatures.query;
      const totalDoc = await Model.countDocuments({ tour: req.params.tourId });

      res.status(200).json({
        status: "success",
        result: doc.length,
        data: { doc },
        totalDoc,
      });
    } catch (err) {
      next(new AppError(err.message, 404));
    }
  };
}

module.exports = { getReviews };
