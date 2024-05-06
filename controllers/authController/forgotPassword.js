const { AppError } = require("../../utils/appError");
const { User } = require("./../../models/userModels/userModel");
const { sendEmail } = require("./../../utils/email");

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    // get User based on posted email
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      throw new Error("we could not find account", 404);
    }

    // generate random token
    const resetToken = currentUser.createPasswordResetToken();

    await currentUser.save({ validateBeforeSave: false });

    // send it to currentUser email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with your new password to:${resetURL}.\nif you didn't forget your password, please ignore this email`;

    await sendEmail({
      email,
      subject: "Your password reset token (Valid for 10 mins)",
      message,
    });

    res
      .status(200)
      .send({ status: "success", message: "token sent to email!" });
  } catch (err) {
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending email please try again !" || err.message,
        err.statusCode || 500
      )
    );
  }
}

module.exports = { forgotPassword };
