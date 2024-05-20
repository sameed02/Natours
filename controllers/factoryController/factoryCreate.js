const { AppError } = require("../../utils/appError");

function createOne(Model) {
  return async function createDoc(req, res, next) {
    try {
      const newDoc = await Model.create({ ...req.body });
      res.status(201).json({
        status: "success",
        data: newDoc,
      });
    } catch (err) {
      return next(
        new AppError(
          `${err.code === 11000 ? "duplicate value" : `${err.message}`}`,
          400
        )
      );
    }
  };
}

// only for review check reviewRoutes for more info
function setTourUserIds(req, res, next) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
}

module.exports = { createOne, setTourUserIds };
