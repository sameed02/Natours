const { Booking } = require("../../models/bookingModel/bookingModel");
const { AppError } = require("../../utils/appError");

async function getBookingByUser(req, res, next) {
  const id = req.user.id;

  try {
    const booking = await Booking.find({ user: id }).populate("user tour");
    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (err) {
    next(new AppError(`no booking was found of id ${id} `, 404));
  }
}

module.exports = { getBookingByUser };
