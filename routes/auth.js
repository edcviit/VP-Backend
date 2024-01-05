// otpRoutes.js
const express = require("express");
const router = express.Router();
const { User, Verification } = require("../db");
const { sendEmailTo } = require("../helpers/mailSender");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.jwtSECRET;
const { SendOTP, VerifyOTP } = require("../helpers/validation");

router.post("/sendOTP", async (req, res) => {
  const payload = req.body;
  const parsedPayload = SendOTP.safeParse(payload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "invalid Email",
    });
    return;
  }
  email = payload.email;
  const user = await User.findOne({ email });
  if (user) {
    console.log(user);
    res.status(403).json({ message: "User already exists" });
    return;
  }
  const expiresAt = new Date(Date.now() + 300000); // Set expiration to 5 minutes

  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  await Verification.create({ email, otp, expiresAt });

  sendEmailTo(email, otp);
  res.json({ msg: "OTP Sent" });
});

router.post("/verifyOTP", async (req, res) => {
  const payload = req.body;
  const parsedPayload = VerifyOTP.safeParse(payload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "input validation Failed (zod error)",
    });
    return;
  }
  email = payload.email;
  otp = payload.otp;
  const storedVerification = await Verification.findOne(
    { email },
    {},
    { sort: { expiresAt: -1 } }
  );
  console.log(storedVerification);
  if (!storedVerification) {
    return res.status(404).json({ error: "Email not found" });
  }
  console.log(otp);
  if (otp == storedVerification.otp) {
    const newUser = new User({
      email,
    });
    await newUser.save();
    const token = jwt.sign({ email, role: "user" }, SECRET);
    await Verification.deleteMany({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    return res.json({ message: "User created successfully", token });
  } else {
    return res.status(401).json({ error: "Invalid OTP" });
  }
});

module.exports = router;
