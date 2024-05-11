const jwt = require("jsonwebtoken");

function createSendToken(res, user, statusCode, data) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(statusCode).send({ status: "success", token, data });
}

module.exports = { createSendToken };
