const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { AppError } = require("./utils/appError");
const { globalErrorHandler } = require("./globalErrorHandler");

const { tourRouter } = require("./routes/tourRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/* Global Middlewares */

const limiter = rateLimit({
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour).
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} on the server`, 404);
  next(err);
});

app.use(globalErrorHandler);
module.exports = { app };
