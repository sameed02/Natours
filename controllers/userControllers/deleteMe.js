const { User } = require("../../models/userModels/userModel");
const { AppError } = require("../../utils/appError");

async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false }).select(
      "+active"
    );
    res.status(200).send({ status: "success", data: null });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { deleteMe };
