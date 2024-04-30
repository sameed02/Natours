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

const User = mongoose.model("User", userSchema);

module.exports = { User };
