const express = require("express");
const {
  protectRoutes,
} = require("../controllers/authController/protectRoutes");
const { createOrder } = require("../controllers/bookingController/checkout");
const {
  paymentVerification,
} = require("../controllers/bookingController/paymentVerification");
const { Booking } = require("../models/bookingModel/bookingModel");
const { getOne } = require("../controllers/factoryController/factoryGetOne");
const {
  getBookingByUser,
} = require("../controllers/bookingController/bookingsByUser");

const bookingRouter = express.Router();

bookingRouter.route("/checkout/:tourId").get(protectRoutes, createOrder);

bookingRouter.route("/bookingByUserId").get(protectRoutes, getBookingByUser);

bookingRouter.route("/:id").get(getOne(Booking, "tour user"));

bookingRouter
  .route("/paymentVerification")
  .post(protectRoutes, paymentVerification);

module.exports = { bookingRouter };
