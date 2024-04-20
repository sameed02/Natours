const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },

    slug: String,

    rating: { type: Number, default: 4.5 },

    price: { type: Number, required: [true, "A tour must have a price"] },

    duration: { type: Number, required: [true, "A tour must have a duration"] },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },

    ratingsAverage: { type: Number, default: 4.5 },

    ratingsQuantity: { type: Number, default: 0 },

    priceDiscount: Number,

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
