const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { AppError } = require("./../../utils/appError");

const userSchema = new mongoose.Schema({
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
});

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

const User = mongoose.model("User", userSchema);

module.exports = { User };
