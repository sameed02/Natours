const { AppError } = require("./../../utils/appError");

function permission(...roles) {
  return function (req, res, next) {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    }
    next();
  };
}

module.exports = { permission };
