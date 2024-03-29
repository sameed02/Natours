const express = require("express");

const { getAllTours } = require("./getAlltours");
const { getTourById } = require("./getTourById");
const { createTour } = require("./createTour");
const { updateTour } = require("./updateTour");
const { deleteTour } = require("./deleteTour");

const app = express();

// parsing body
app.use(express.json());

//routes

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(3000, () => console.log(`app is listening on port 3000`));
