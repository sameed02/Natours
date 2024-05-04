const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { User } = require("../../models/userModels/userModel");
const { AppError } = require("./../../utils/appError");

async function protectRoutes(req, res, next) {
  try {
    // Check if the Authorization header is present
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new Error("Unauthorized");
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized");
    }

    // verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);

    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("user belonging to this token no longer exist");
    }

    // chaeck if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("user recentlty changed password", 401));
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError(err.message, 401));
  }
}

module.exports = { protectRoutes };
