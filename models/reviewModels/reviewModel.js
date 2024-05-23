const mongoose = require("mongoose");
const { Tour } = require("../tourModels/tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review cannot be empty"],
    },

    rating: { type: Number, min: 1, max: 5 },

    createdAt: { type: Date, default: Date.now },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name ",
    options: { errorIfNotFound: true },
  });
  next();
});

// in a static method i.e statics, this keyword points to current model
reviewSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
  console.log(stats);
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
