const { AppError } = require("./../../utils/appError");

function updateOne(Model) {
  return async function updateDoc(req, res, next) {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        throw new AppError("no document was found with that id", 404);
      }

      res.status(201).json({
        status: "success",
        data: { updatedDoc: doc },
      });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 500));
    }
  };
}

module.exports = { updateOne };
