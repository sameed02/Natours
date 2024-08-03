const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "booking must belong to user"],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "booking must belong to tour"],
    },

    price: {
      type: Number,
      required: [true, "booking must have a price"],
    },

    createdAt: {
      type: Date,
    },

    paid: {
      type: Boolean,
      default: false,
    },

    paymentId: {
      type: String,
      required: [true, "booking must have payment id"],
    },

    orderId: {
      type: String,
      required: [true, "booking must have order id"],
    },

    signature: {
      type: String,
      required: [true, "booking must have a payment signature"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name _id startDates duration",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Booking };
