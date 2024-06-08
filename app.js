const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");

const { AppError } = require("./utils/appError");
const { globalErrorHandler } = require("./globalErrorHandler");

const { tourRouter } = require("./routes/tourRoutes");
const { userRouter } = require("./routes/userRoutes");
const { reviewRouter } = require("./routes/reviewRoutes");

/* ------------------- APP ------------------- */

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/* Global Middlewares */

// Implement Cors

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// setting up security HTTP headers
app.use(helmet());

// limit no of api requests
const limiter = rateLimit({
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 1 hour).
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body & putting into req.body
app.use(express.json({ limit: "10kb" }));

// parses data from cookie
app.use(cookieParser());

// preventing parameter pollution, whitelist is array of properties for which we allow duplicate values
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use((req, res, next) => {
  console.log("JWT Cookie:", req.cookies.jwt);
  next();
});

//routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// error middleware for accessing undefined routes
app.use((req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} on the server`, 404);
  next(err);
});

// globalerror handling middleware
app.use(globalErrorHandler);

module.exports = { app };
