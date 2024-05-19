const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { AppError } = require("./../../utils/appError");
const { type } = require("os");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Please provide your email!"],
      validate: [validator.isEmail, "Please provide valid email!"],
    },
    photo: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "tour-guide", "lead-guide", "admin"],
      default: "user",
    },

    password: {
      type: String,
      trim: true,
      minlength: [8, "Password must be at least 8 characters long"],
      required: [true, "Please enter your password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: [true, "Please confirm your password"],
      validate: {
        // This validator only works on CREATE and SAVE!!!
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/* ------------------- Middlewares OR Instance Methods ------------------ */

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    } else {
      const salt = await bcrypt.genSalt(12);

      // Hash the password along with the new salt
      const hashedPassword = await bcrypt.hash(this.password, salt);

      // Replace the plain password with the hashed password
      this.password = hashedPassword;
      this.passwordConfirm = undefined;
      next();
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, 400));
  }
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  } else {
    this.passwordChangedAt = Date.now() - 1000;
    next();
  }
});

userSchema.pre(/^find/, function (next) {
  // this points to current query
  this.find({ active: { $ne: false } });
  next();
});

// instance method is basically a method that is gonna be available on all documents of a certain collection, candidatePassword = coming from user && userPassword = coming from Database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimeStamp;
  }

  // false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // creating reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // saving reset token with encryption into Database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  // setting time of token expiry i.e 10 minutes in this case
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // this is initial token before encryption is what we're going to send user
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
