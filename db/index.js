const mongoose = require("mongoose");
require("dotenv").config();

const MongoLink = process.env.MONGOSTRING + process.env.DB;
mongoose.connect(MongoLink);

const userSchema = new mongoose.Schema({
  phoneNumber: Number,
  name: String,
  email: String,
  college: String,
  city: String,
  year: String,
  vip: { type: Boolean, default: false },
});
const verificationSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});
const registrationSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: String,
  college: String,
  city: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

const User = mongoose.model("User", userSchema);
const Verification = mongoose.model("Verification", verificationSchema);

module.exports = {
  User,
  Verification,
  Registration,
};
