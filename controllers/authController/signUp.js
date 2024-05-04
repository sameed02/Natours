const { User } = require("../../models/userModels/userModel");
const { AppError } = require("./../../utils/appError");
const jwt = require("jsonwebtoken");

async function signUp(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      ...other
    } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).send({
      status: "success",
      token,
      data: { user: newUser },
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
