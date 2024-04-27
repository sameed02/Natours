const express = require("express");
const morgan = require("morgan");

const { AppError } = require("./utils/appError");
const {
  errorController,
} = require("./controllers/errorController/errorController");

const { tourRouter } = require("./routes/tourRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} on the server`, 404);
  next(err);
});

app.use(errorController);
module.exports = { app };
