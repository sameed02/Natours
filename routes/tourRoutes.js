const express = require("express");

const { getAllTours } = require("../controllers/tourControllers/getAlltours");
const { getTourById } = require("../controllers/tourControllers/getTourById");
const { createTour } = require("../controllers/tourControllers/createTour");
const { updateTour } = require("../controllers/tourControllers/updateTour");
const { deleteTour } = require("../controllers/tourControllers/deleteTour");
const { topTours } = require("../controllers/tourControllers/topTours");

const tourRouter = express.Router();

tourRouter.route("/top-5-tours").get(topTours, getAllTours);

tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
