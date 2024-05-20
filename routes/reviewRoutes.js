const express = require("express");

const { Review } = require("../models/reviewModels/reviewModel");

const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");
const { permission } = require("./../controllers/authController/permission");
const {
  createReview,
} = require("./../controllers/reviewController/createReview");
const { getReviews } = require("./../controllers/reviewController/getReviews");

const { deleteOne } = require("../controllers/factoryController/factoryDelete");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(protectRoutes, permission("user"), getReviews)
  .post(protectRoutes, permission("user"), createReview);

reviewRouter.route("/:id").delete(deleteOne(Review));
module.exports = { reviewRouter };
