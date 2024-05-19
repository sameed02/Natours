const express = require("express");

const {
  protectRoutes,
} = require("./../controllers/authController/protectRoutes");
const { permission } = require("./../controllers/authController/permission");
const {
  createReview,
} = require("./../controllers/reviewController/createReview");
const { getReviews } = require("./../controllers/reviewController/getReviews");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(protectRoutes, permission("user"), getReviews)
  .post(protectRoutes, permission("user"), createReview);

module.exports = { reviewRouter };
