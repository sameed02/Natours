const { User } = require("../../models/userModels/userModel");
const { AppError } = require("../../utils/appError");

async function updateMe(req, res, next) {
  // create error if user posts Password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("this route is not for password updates", 400));
  }

  // update document (only name and emails, we can't allow user to update role,password from here otherwise anyone could be an admin and since we are using findByIdAndUpdate which will not run our middlewares we can;t allow user to update password here)
  const { name, email, ...other } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).send({ status: "success", data: { user: updatedUser } });
}

module.exports = { updateMe };
