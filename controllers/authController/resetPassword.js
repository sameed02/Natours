const { AppError } = require("./../../utils/appError");
const { User } = require("./../../models/userModels/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

async function resetPassword(req, res, next) {
  try {
    // get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const currentUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // update password if token hasn't expired and the user exists
    if (!currentUser) {
      throw new Error("Token is invalid or expired !", 400);
    }

    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.passwordConfirm;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();

    // update passwordChangedAt property
    // log the user in
    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).send({ status: "success", token });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode));
  }
}

module.exports = { resetPassword };
