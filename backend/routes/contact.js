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
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, city, contentType, date, message } = req.body;

    if (!name || !email || !phone || !city) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 1. Save to database
    const saved = await ContactRequest.create({
      name, email, phone, city, contentType, date, message,
    });

    // 2. Notify your team by email (skips silently if SMTP isn't configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
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
    }

    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
