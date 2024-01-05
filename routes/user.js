const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User } = require("../db");
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
