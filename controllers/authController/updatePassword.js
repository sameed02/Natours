const { AppError } = require("./../../utils/appError");
const { User } = require("./../../models/userModels/userModel");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).send({ status: "success", token });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { updatePassword };
