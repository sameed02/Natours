const crypto = require("crypto");
const { Booking } = require("../../models/bookingModel/bookingModel");

async function paymentVerification(req, res, next) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("sign received:", razorpay_signature);
  console.log("sign generated:", expectedSign);

  if (expectedSign === razorpay_signature) {
    // Save booking information in the database
    try {
      const order = JSON.parse(decodeURIComponent(req.query.order));

      const booking = await Booking.create({
        user: req.user._id,
        tour: order.tourId,
        price: order.amount,
        createdAt: order.created_at,
        paid: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      });

      res.redirect(
        `https://natours-client.vercel.app/payment-success?payment=${razorpay_payment_id}`
      );
    } catch (error) {
      console.error("Error saving booking:", error);
      res.redirect(
        `https://natours-client.vercel.app/payment-success?payment="fail"`
      );
    }
  } else {
    res.redirect(
      `https://natours-client.vercel.app/payment-success?payment="fail"`
    );
  }
}

module.exports = { paymentVerification };
