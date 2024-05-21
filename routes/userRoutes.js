const express = require("express");
const { User } = require("../models/userModels/userModel");
const { deleteOne } = require("../controllers/factoryController/factoryDelete");
const { updateOne } = require("../controllers/factoryController/factoryUpdate");

const { getAllUsers } = require("../controllers/userControllers/getAllusers");
const { getUserById } = require("../controllers/userControllers/getUserById");

const { signUp } = require("../controllers/authController/signUp");
const { login } = require("./../controllers/authController/login");
const {
  forgotPassword,
} = require("./../controllers/authController/forgotPassword");
const {
  resetPassword,
} = require("./../controllers/authController/resetPassword");
const {
  updatePassword,
} = require("./../controllers/authController/updatePassword");
const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");

const { updateMe } = require("./../controllers/userControllers/updateMe");
const { deleteMe } = require("./../controllers/userControllers/deleteMe");
const { getOne } = require("../controllers/factoryController/factoryGetOne");
const { getAll } = require("../controllers/factoryController/factoryGetAll");

/* ------------------------ Body ------------------------ */

const userRouter = express.Router();

userRouter.route("/sign-up").post(signUp);
userRouter.route("/login").post(login);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword/:token").patch(resetPassword);
userRouter.route("/updatePassword").patch(protectRoutes, updatePassword);

userRouter.route("/updateMe").patch(protectRoutes, updateMe);
userRouter.route("/deleteMe").delete(protectRoutes, deleteMe);

userRouter.route("/allUsers").get(getAll(User));

// this route is only for admin, don't attemp to change password with this
userRouter
  .route("/:id")
  .get(getOne(User))
  .patch(updateOne(User))
  .delete(deleteOne(User));

module.exports = { userRouter };
