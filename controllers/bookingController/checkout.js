const { Tour } = require("../../models/tourModels/tourModel");
const instance = require("../../razorpay");
const { v4: uuidv4 } = require("uuid");
const { AppError } = require("../../utils/appError");

async function createOrder(req, res, next) {
  try {
    // get currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    const options = {
      amount: tour.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: uuidv4().split("-").join(""),
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      status: "success",
      data: { order },
      user: req.user,
    });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { createOrder };
