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

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
  console.log(stats);
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.tour);
  console.log(this.tour);
});

// Post middleware will get the doc as the first argument. So the post middleware will get the updated review as an argument.
reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAvgRating(doc.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
