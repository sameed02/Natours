const express = require("express");

const { getAllTours } = require("../controllers/tourControllers/getAlltours");
const { getTourById } = require("../controllers/tourControllers/getTourById");
const { createTour } = require("../controllers/tourControllers/createTour");
const { updateTour } = require("../controllers/tourControllers/updateTour");
const { deleteTour } = require("../controllers/tourControllers/deleteTour");
const { checkId } = require("../controllers/tourControllers/checkId");

const tourRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter.param("id", checkId);

tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
