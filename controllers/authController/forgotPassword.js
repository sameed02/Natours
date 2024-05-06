const { AppError } = require("../../utils/appError");
const { User } = require("./../../models/userModels/userModel");

async function forgotPassword(req, res, next) {
  try {
    // get User based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("we could not find account", 404);
    }
    // generate random token

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
    // send it to user email
  } catch (err) {
    return next(new AppError(err.message, err.statusCode || 400));
  }
}

module.exports = { forgotPassword };
