const { User } = require("../../models/userModels/userModel");
const { AppError } = require("./../../utils/appError");
const bcrypt = require("bcrypt");

async function signUp(req, res, next) {
  try {
    const newUser = await User.create({ ...req.body });
    res.status(201).send({
      status: "success",
      data: newUser,
    });
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
