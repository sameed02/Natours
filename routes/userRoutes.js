const express = require("express");

const { getAllUsers } = require("../controllers/userControllers/getAllusers");
const { getUserById } = require("../controllers/userControllers/getUserById");
const { updateUser } = require("../controllers/userControllers/updateUser");
const { deleteUser } = require("../controllers/userControllers/deleteUser");

const { signUp } = require("../controllers/authController/signUp");
const { login } = require("./../controllers/authController/login");
const {
  forgotPassword,
} = require("./../controllers/authController/forgotPassword");
const {
  resetPassword,
} = require("./../controllers/authController/resetPassword");

const userRouter = express.Router();

userRouter.route("/sign-up").post(signUp);
userRouter.route("/login").post(login);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword").post(resetPassword);

userRouter.route("/allUsers").get(getAllUsers);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
