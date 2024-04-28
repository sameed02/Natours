const mongoose = require("mongoose");
const validator = require("validator");

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
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
