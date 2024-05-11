const jwt = require("jsonwebtoken");

function createSendToken(res, user, statusCode, data) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);

  // here we're setting password to undefined only to not send the password in response to client but the password as undefined is not persisted in DB
  user.password = undefined;

  res.status(statusCode).send({ status: "success", token, data });
}

module.exports = { createSendToken };
