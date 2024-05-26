const express = require("express");

// Router
const { reviewRouter } = require("./../routes/reviewRoutes");

// Model
const { Tour } = require("../models/tourModels/tourModel");

// Controllers
const { topTours } = require("../controllers/tourControllers/topTours");
const { getTourStats } = require("../controllers/tourControllers/getTourStats");

const {
  getMonthlyPlan,
} = require("../controllers/tourControllers/getMonthlyPlan");
const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");
const { permission } = require("./../controllers/authController/permission");

const { deleteOne } = require("../controllers/factoryController/factoryDelete");
const { createOne } = require("../controllers/factoryController/factoryCreate");
const { updateOne } = require("../controllers/factoryController/factoryUpdate");
const { getOne } = require("../controllers/factoryController/factoryGetOne");
const {
  getAll,
  setTourId,
} = require("../controllers/factoryController/factoryGetAll");
const {
  getToursWithin,
} = require("../controllers/tourControllers/getToursWithin");

/* ------------------------ Body ------------------------ */

const tourRouter = express.Router();

tourRouter.use("/:tourId/reviews", setTourId, reviewRouter);

tourRouter.route("/tour-stats").get(getTourStats);

tourRouter
  .route("/monthly-plan/:year")
  .get(
    protectRoutes,
    permission("admin", "lead-guide", "guide"),
    getMonthlyPlan
  );
tourRouter.route("/top-5-tours").get(topTours, getAll(Tour));

tourRouter
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

tourRouter
  .route("/")
  .get(getAll(Tour))
  .post(protectRoutes, permission("admin", "lead-guide"), createOne(Tour));

tourRouter
  .route("/:id")
  .get(getOne(Tour, "reviews"))
  .patch(protectRoutes, permission("admin", "lead-guide"), updateOne(Tour))
  .delete(protectRoutes, permission("admin", "lead-guide"), deleteOne(Tour));

module.exports = { tourRouter };
