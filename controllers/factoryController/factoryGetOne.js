const { AppError } = require("../../utils/appError");

function getOne(Model, PopOptions) {
  return async function getDocById(req, res, next) {
    const id = req.params.id;
    try {
      let query = Model.findById(id);

      if (PopOptions) {
        query = query.populate(PopOptions);
      }

      const doc = await query;

      if (!doc) throw new AppError("no document found with given id", 404);

      res.status(200).json({
        status: "success",
        data: { doc },
      });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 500));
    }
  };
}

module.exports = { getOne };
