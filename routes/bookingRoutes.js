const express = require("express");
const {
  protectRoutes,
} = require("../controllers/authController/protectRoutes");
const { createOrder } = require("../controllers/bookingController/checkout");
const {
  paymentVerification,
} = require("../controllers/bookingController/paymentVerification");

const bookingRouter = express.Router();

bookingRouter.route("/checkout/:tourId").get(protectRoutes, createOrder);

bookingRouter
  .route("/paymentVerification")
  .post(protectRoutes, paymentVerification);

module.exports = { bookingRouter };
