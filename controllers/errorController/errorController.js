function errorController(err, req, res, next) {
  const { statusCode, status, message } = err;
  res.status(statusCode).send({
    status,
    message,
  });
}

module.exports = { errorController };
