const { AppError } = require("./../../utils/appError");
const { User } = require("./../../models/userModels/userModel");

const { createSendToken } = require("./createSendToke");

async function updatePassword(req, res, next) {
  try {
    const { password, newPassword, newPasswordConfirm } = req.body;

    // get user
    const currentUser = await User.findOne({ _id: req.user.id }).select(
      "+password"
    );

    // check if entered current password is correct
    if (
      !currentUser ||
      !(await currentUser.correctPassword(password, currentUser.password))
    ) {
      throw new AppError("Incorrect email or password", 401);
    }

    // if so, update the password
    currentUser.password = newPassword;
    currentUser.passwordConfirm = newPasswordConfirm;
    await currentUser.save();

    // log the user i.e sent back jwt token to client
    createSendToken(res, currentUser, 200);
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { updatePassword };
