const nodemailer = require("nodemailer");

async function sendEmail(options) {
  // create transporter i.e transporter is server that will send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: "Sameed Ahmad <sameed@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email with nodemailer
  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
