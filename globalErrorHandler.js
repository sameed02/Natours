function globalErrorHandler(err, req, res, next) {
  const { statusCode, status, message } = err;

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).send({
      status,
      message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(statusCode).send({
        status,
        message,
      });
    } else {
      console.error("ERROR 💥", err);

      res.status(500).send({
        status: "error",
        message: "something went wrong",
      });
    }
  }
}

module.exports = { globalErrorHandler };
