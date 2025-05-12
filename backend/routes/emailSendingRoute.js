const express = require("express");
const sendEmail = require("../emailService");

const router = express.Router();

router.post("/test-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendEmail(to, subject, message);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email sending failed", error });
  }
});

module.exports = router;
