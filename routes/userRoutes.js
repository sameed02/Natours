const express = require("express");
const { User } = require("../models/userModels/userModel");
const { deleteOne } = require("../controllers/factoryController/factoryDelete");
const { updateOne } = require("../controllers/factoryController/factoryUpdate");

const { getAllUsers } = require("../controllers/userControllers/getAllusers");
const { getUserById } = require("../controllers/userControllers/getUserById");

const { signUp } = require("../controllers/authController/signUp");
const { login } = require("./../controllers/authController/login");
const { logout } = require("../controllers/authController/logout");
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
const { permission } = require("../controllers/authController/permission");

/* ------------------------ Body ------------------------ */

const userRouter = express.Router();

userRouter.route("/sign-up").post(signUp);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword/:token").patch(resetPassword);

userRouter.use(protectRoutes);

userRouter.route("/updatePassword").patch(updatePassword);

function setUserId(req, res, next) {
  req.params.id = req.user.id;
  next();
}

userRouter.route("/me").get(setUserId, getOne(User));

userRouter.route("/allUsers").get(getAll(User));
userRouter.route("/updateMe").patch(updateMe);
userRouter.route("/deleteMe").delete(deleteMe);

userRouter.use(permission("admin"));
// don't attemp to change password with updateOne
userRouter
  .route("/:id")
  .get(getOne(User))
  .patch(updateOne(User))
  .delete(deleteOne(User));

module.exports = { userRouter };
