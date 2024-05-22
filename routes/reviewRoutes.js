const express = require("express");

const { Review } = require("../models/reviewModels/reviewModel");

const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");
const { permission } = require("./../controllers/authController/permission");

const { deleteOne } = require("../controllers/factoryController/factoryDelete");
const { updateOne } = require("../controllers/factoryController/factoryUpdate");
const { getOne } = require("../controllers/factoryController/factoryGetOne");
const { getAll } = require("../controllers/factoryController/factoryGetAll");

const {
  setTourUserIds,
  createOne,
} = require("../controllers/factoryController/factoryCreate");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protectRoutes);

reviewRouter
  .route("/")
  .get(permission("user", "admin"), getAll(Review))
  .post(permission("user"), setTourUserIds, createOne(Review));

reviewRouter
  .route("/:id")
  .get(getOne(Review))
  .delete(permission("user", "admin"), deleteOne(Review))
  .patch(permission("user", "admin"), updateOne(Review));

module.exports = { reviewRouter };
