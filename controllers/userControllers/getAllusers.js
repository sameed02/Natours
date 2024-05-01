const { User } = require("../../models/userModels/userModel");

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({}).sort("_id");
    res.status(200).json({
      status: "success",
      result: users.length,
      data: { users: users },
    });
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
}

module.exports = { getAllUsers };
