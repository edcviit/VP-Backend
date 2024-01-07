const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User, Registration } = require("../db");
const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const user = await User.findOne({ email: req.email });
  console.log(user);
  if (!user) {
    res.status(403).json({ msg: "User doesn't exist" });
    return;
  }
  res.json({
    user,
  });
});
// Update the /api/register route in server.js

router.post('/api/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, college, city } = req.body;

    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({ message: 'Please enter a valid Full Name' });
    }

    const phoneRegex = /^\d{10}$/; 
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Please enter a valid Phone Number' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid Email address' });
    }

    if (!college || college.trim() === '') {
      return res.status(400).json({ message: 'Please enter a valid College name' });
    }

    if (!city || city.trim() === '') {
      return res.status(400).json({ message: 'Please enter a valid City name' });
    }

    const newRegistration = new Registration({ fullName, phoneNumber, email, college, city });
    await newRegistration.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post("/details",authenticateJwt, async (req, res) => {
  const { name, college, city, year, phoneNumber } = req.body;

  try {
    const result = await User.updateOne(
      { email: req.email },
      { $set: {name, college, city, year, phoneNumber } }
    );

    // Check if a document was matched and modified
    if (result.matchedCount > 0 && result.modifiedCount > 0) {
      return res.json({ message: "User details updated successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "User not found or details not updated" });
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(email + "trying to login");
  if (user) {
    const token = jwt.sign({ email, role: "user" }, SECRET, {
      expiresIn: "10h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

router.post("/check", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log("checking" + user);
  if (user) {
    res.status(200).json({ message: "Exists" });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

module.exports = router;
