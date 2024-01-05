const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, //true for 467, false for others
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

async function sendEmailTo(email, code) {
  const info = await transporter.sendMail({
    from: { name: "VISHWAPRENEUR", address: process.env.USER }, // sender address
    to: email,
    subject: "Verification Code",
    text: "Your code is: " + code,
  });
  console.log("mail sent");
  return "mail sent: " + info.messageId;
}

// sendEmailTo("rohanv.rvaidya@gmail.com", 1246);
module.exports = {
  sendEmailTo,
};
