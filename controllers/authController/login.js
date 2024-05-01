const { User } = require("../../models/userModels/userModel");
const jwt = require("jsonwebtoken");
const { AppError } = require("./../../utils/appError");

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

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // sent the jwt token back to client
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).send({ status: "success", token });
}

module.exports = { login };
