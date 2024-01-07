const express = require("express");
const { Registration } = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fullName, phoneNumber, email, college, city } = req.body;

    if (!fullName || fullName.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please enter a valid Full Name" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid Phone Number" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid Email address" });
    }

    if (!college || college.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please enter a valid College name" });
    }

    if (!city || city.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please enter a valid City name" });
    }

    const newRegistration = new Registration({
      fullName,
      phoneNumber,
      email,
      college,
      city,
    });
    await newRegistration.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
