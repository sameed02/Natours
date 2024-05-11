const { User } = require("../../models/userModels/userModel");
const { AppError } = require("./../../utils/appError");
const { createSendToken } = require("./createSendToke");

async function login(req, res, next) {
  const { email, password } = req.body;

  // check if email and pass exists
  if (!email || !password) {
    return next(
      AppError(`please provide ${!email ? "email" : "password"}!`, 400)
    );
  }

  // check if user exists and pass is correct
  const user = await User.findOne({ email }).select("+password");

  // user.correctPassword is instance method defined on User Model
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // sent the jwt token back to client
  createSendToken(res, user, 200);
}

module.exports = { login };
