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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name _id photo ",
    options: { errorIfNotFound: true },
  }).populate({
    path: "tour",
    select: "name _id",
  });
  next();
});

// in a static method i.e statics, this keyword points to current model
reviewSchema.statics.calcAvgRating = async function (tourId) {
  try {
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

    console.log("Aggregation results:", stats);

    if (stats.length > 0) {
      const roundedAvgRating = Math.round(stats[0].avgRating * 10) / 10;
      await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: roundedAvgRating /* stats[0].avgRating */,
      });
    } else {
      await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }
    console.log("Tour ratings updated successfully");
    console.log("final stats", stats);
  } catch (err) {
    console.log(err.message);
  }
};

reviewSchema.post("save", function () {
  console.log("Post Save Middleware: ", this.tour);
  this.constructor.calcAvgRating(this.tour);
});

// Post middleware will get the doc as the first argument. So the post middleware will get the updated review as an argument.
reviewSchema.post(/^findOneAnd/, async function (doc) {
  console.log("Post FindOneAnd Middleware: ", doc.tour._id);
  await doc.constructor.calcAvgRating(doc.tour._id);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
