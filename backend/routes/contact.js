const express = require("express");
const nodemailer = require("nodemailer");
const ContactRequest = require("../models/ContactRequest");

const router = express.Router();

// Email transporter — reads from .env (see .env.example)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 8000,
});

router.post("/", async (req, res) => {
  const { name, email, phone, city, contentType, date, message } = req.body;

  if (!name || !email || !phone || !city) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let saved;
  try {
    saved = await ContactRequest.create({
      name, email, phone, city, contentType, date, message,
    });
  } catch (err) {
    console.error("Database save error:", err);
    return res.status(500).json({ error: "Could not save your request. Please try again." });
  }

  res.status(201).json({ ok: true, id: saved._id });

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.sendMail({
        from: `"Reclick Media Website" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_TO_EMAIL,
        subject: `New booking request from ${name} (${city})`,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
Content type: ${contentType}
Preferred date: ${date}
Message: ${message}
        `.trim(),
      });
    } catch (err) {
      console.error("Email notification failed (lead was still saved):", err.message);
    }
  }
});

module.exports = router;