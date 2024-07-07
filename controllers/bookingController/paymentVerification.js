const crypto = require("crypto");

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
    // do something in db and redirect
    res.redirect(
      `http://localhost:5173/payment-success?payment=${razorpay_payment_id}`
    );
  } else {
    res.redirect(`http://localhost:5173/payment-success?payment="fail"`);
  }
}

module.exports = { paymentVerification };
