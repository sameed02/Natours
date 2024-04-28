const express = require("express");

const { getAllUsers } = require("../controllers/userControllers/getAllusers");
const { getUserById } = require("../controllers/userControllers/getUserById");
const { signUp } = require("../controllers/authController/signUp");
const { updateUser } = require("../controllers/userControllers/updateUser");
const { deleteUser } = require("../controllers/userControllers/deleteUser");

const userRouter = express.Router();

userRouter.route("/sign-up").post(signUp);

userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
