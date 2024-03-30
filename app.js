const express = require("express");
const morgan = require("morgan");

const { getAllTours } = require("./getAlltours");
const { getTourById } = require("./getTourById");
const { createTour } = require("./createTour");
const { updateTour } = require("./updateTour");
const { deleteTour } = require("./deleteTour");

const { getAllUsers } = require("./getAllusers");
const { getUserById } = require("./getUserById");
const { createUser } = require("./createUser");
const { updateUser } = require("./updateUser");
const { deleteUser } = require("./deleteUser");

const app = express();

app.use(morgan("dev"));

// parsing body
app.use(express.json());

// tour routes

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

// user routes

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

app.listen(3000, () => console.log(`app is listening on port 3000`));
