const express = require("express");
const morgan = require("morgan");

const { tourRouter } = require("./routes/tourRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use((req, res, next) => {
  res.status(404).send({
    status: "fail",
    message: `can't find ${req.originalUrl} on the server`,
  });
});
module.exports = { app };
