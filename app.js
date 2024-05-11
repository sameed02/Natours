const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const { AppError } = require("./utils/appError");
const { globalErrorHandler } = require("./globalErrorHandler");

const { tourRouter } = require("./routes/tourRoutes");
const { userRouter } = require("./routes/userRoutes");

/* ------------------- APP ------------------- */

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/* Global Middlewares */

// setting up security HTTP headers
app.use(helmet());

// limit no of api requests
const limiter = rateLimit({
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour).
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body & putting into req.body
app.use(express.json({ limit: "10kb" }));

//routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// error middleware for accessing undefined routes
app.use((req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} on the server`, 404);
  next(err);
});

// globalerror handling middleware
app.use(globalErrorHandler);

module.exports = { app };
