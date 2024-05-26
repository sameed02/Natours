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

    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10),
    },

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

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"], // 'type' must be 'Point'
      },
      coordinates: [Number], // Array of numbers (longitude, latitude)
      address: String,
      description: String,
    },
    //Whenever you define an object in an array, Mongoose creates a schema for it behind the scenes so it treats it as a subdocument. A consequence of this is that Mongoose will add an _id field to each object.
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],

        address: String,
        description: String,
        day: Number,
      },
    ],
    // child refrencing data from other collection
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// for geospatial data this index needs to be 2d sphere
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

///virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour", // name of the field in the refrenced model.
  localField: "_id", // tour id is stored in tourModel and in foreignModel in tour property is where tour id is also stored to connect both models with each other
});

//Document Middleware runs before .save() and create() only. This keyword points to currently process document, each pre middleware have access to "next" just like in express.

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* // this is how could have implemented using embedding
tourSchema.pre("save", async function (next) {
  if (this.guides && this.guides.length > 0) {
    //Using await inside map: When you use await inside the map callback, await ensures that each individual asynchronous operation (User.findById(id)) is awaited before the value is returned within that callback.However, the map function itself does not wait for the await to complete. Instead, map simply returns an array of promises created by the async callback function.
    try {
      const guidesPromises = this.guides.map(async (id) => {
        const user = await User.findById(id);
        return user;
      });

      this.guides = await Promise.all(guidesPromises);
    } catch (err) {
      return next(
        new AppError("guides is either empty or no user was found", 404)
      );
    }
  }
}); */

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
    options: { errorIfNotFound: true }, // Throw error if referenced document not found
  });

  next();
});

// Aggregation Middleware here this keyword points to current aggregation obj
/* tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
}); */
tourSchema.pre("aggregate", function (next) {
  // Hide secret tours if geoNear is NOT used
  if (!(this.pipeline().length > 0 && "$geoNear" in this.pipeline()[0])) {
    this.pipeline().unshift({
      $match: { secretTour: { $ne: true } },
    });
  }
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = { Tour };
