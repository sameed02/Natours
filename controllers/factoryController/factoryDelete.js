const { AppError } = require("../../utils/appError");

/* async function deleteTour(req, res, next) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      message: "tour successfully deleted",
    });
  } catch (error) {
    next(new AppError("invalid id", 404));
  }
} */

function deleteOne(Model) {
  return async function deleteDoc(req, res, next) {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) throw new AppError("no document found with that id", 404);

      res.status(201).json({
        status: "success",
        message: "document successfully deleted",
        data: null,
      });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 500));
    }
  };
}

module.exports = { deleteOne };
