const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal to 40 characters"],
      minlength: [10, "A tour name must have more or equal to 10 characters"],
      validate: {
        validator: function (value) {
          return validator.isAlpha(value.split(" ").join(""));
        },
        message: "Tour name must only contain characters.",
      },
    },

    slug: String,

    rating: {
      type: Number,
      default: 4.5,
      min: [1, "minimum rating should be equal or more than 1"],
      max: [5, "maximum rating should equal or less than 5"],
    },

    price: { type: Number, required: [true, "A tour must have a price"] },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return !this.price || val < this.price;
        },
        message:
          "Discount price ({VALUE}) should be less than the actual price",
      },
    },

    duration: { type: Number, required: [true, "A tour must have a duration"] },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficult is either easy, medium or difficult",
      },
    },

    ratingsAverage: { type: Number, default: 4.5 },

    ratingsQuantity: { type: Number, default: 0 },

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },

    description: { type: String, trim: true },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover-image"],
    },

    images: [String],

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Document Middleware runs before .save() and create() only. This keyword points to currently process document, each pre middleware have access to "next" just like in express.
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after save, or after all pre middlewares, in post middleware we also have access to document that was just saved along with next middleware
/* tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
}); */

// Query Middleware runs for queries i.e find. this keywords doesn't point to current processed document instead this keywords is an query Object. here /^find/ is a regular expression which means this query middleware will run for any function that starts with find when querying from database.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation Middleware here this keyword points to current aggregation obj
tourSchema.pre("aggregate", function (next) {
  console.log(this);
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = { Tour };
