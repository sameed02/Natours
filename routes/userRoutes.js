const express = require("express");

const { getAllUsers } = require("../controllers/userControllers/getAllusers");
const { getUserById } = require("../controllers/userControllers/getUserById");
const { createUser } = require("../controllers/userControllers/createUser");
const { updateUser } = require("../controllers/userControllers/updateUser");
const { deleteUser } = require("../controllers/userControllers/deleteUser");

const userRouter = express.Router();
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
