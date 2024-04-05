const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "A tour must have a price"] },
});

const Tour = mongoose.model("Tour", tourSchema);

function saveTour(res, data) {
  data
    .save()
    .then((doc) => {
      return res.status(200).json(doc);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: "fail", message: "tour name must be unique" });
    });
}

module.exports = { saveTour, Tour };
