const express = require("express");

const { Tour } = require("../models/tourModels/tourModel");

const { getAllTours } = require("../controllers/tourControllers/getAlltours");
const { getTourById } = require("../controllers/tourControllers/getTourById");
const { createTour } = require("../controllers/tourControllers/createTour");
const { updateTour } = require("../controllers/tourControllers/updateTour");

const { topTours } = require("../controllers/tourControllers/topTours");
const { getTourStats } = require("../controllers/tourControllers/getTourStats");

const {
  getMonthlyPlan,
} = require("../controllers/tourControllers/getMonthlyPlan");
const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");
const { permission } = require("./../controllers/authController/permission");
const { reviewRouter } = require("./../routes/reviewRoutes");
const { deleteOne } = require("../controllers/factoryController/factoryDelete");

const tourRouter = express.Router();

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/top-5-tours").get(topTours, getAllTours);

tourRouter.route("/").get(protectRoutes, getAllTours).post(createTour);

tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(protectRoutes, permission("admin", "lead"), deleteOne(Tour));

module.exports = { tourRouter };
