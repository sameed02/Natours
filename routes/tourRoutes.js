const express = require("express");

const { getAllTours } = require("../controllers/tourControllers/getAlltours");
const { getTourById } = require("../controllers/tourControllers/getTourById");
const { createTour } = require("../controllers/tourControllers/createTour");
const { updateTour } = require("../controllers/tourControllers/updateTour");
const { deleteTour } = require("../controllers/tourControllers/deleteTour");
const { topTours } = require("../controllers/tourControllers/topTours");
const { getTourStats } = require("../controllers/tourControllers/getTourStats");
const {
  getMonthlyPlan,
} = require("../controllers/tourControllers/getMonthlyPlan");

const tourRouter = express.Router();

tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/top-5-tours").get(topTours, getAllTours);

tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
