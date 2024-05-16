const { User } = require("../../models/userModels/userModel");
const { AppError } = require("./../../utils/appError");
const { createSendToken } = require("./createSendToken");

async function signUp(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      role,
      ...other
    } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      role,
    });

    createSendToken(res, newUser, 201, { user: newUser });
  } catch (err) {
    if (err.code === 11000) {
      const duplcateField = Object.keys(err.keyValue)[0];
      next(new AppError(`${duplcateField} is already in use`, 400));
    } else {
      next(new AppError(`${Object.values(err.errors)[0].message}`, 400));
    }
  }
}

module.exports = { signUp };
