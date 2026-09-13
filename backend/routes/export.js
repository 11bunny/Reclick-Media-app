const express = require("express");
const ContactRequest = require("../models/ContactRequest");

const router = express.Router();

function toCsvValue(value) {
  if (value === undefined || value === null) return "";
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

// GET /api/contact/export?key=YOUR_ADMIN_EXPORT_KEY
// Downloads all contact submissions as a .csv file — open it directly in Excel/Google Sheets.
router.get("/export", async (req, res) => {
  try {
    if (!process.env.ADMIN_EXPORT_KEY || req.query.key !== process.env.ADMIN_EXPORT_KEY) {
      return res.status(401).json({ error: "Missing or invalid export key." });
    }

    const rows = await ContactRequest.find().sort({ createdAt: -1 }).lean();

    const headers = ["Created At", "Name", "Email", "Phone", "City", "Content Type", "Preferred Date", "Message", "Status"];
    const lines = [headers.map(toCsvValue).join(",")];

    for (const row of rows) {
      lines.push(
        [
          row.createdAt ? new Date(row.createdAt).toISOString() : "",
          row.name,
          row.email,
          row.phone,
          row.city,
          row.contentType,
          row.date,
          row.message,
          row.status,
        ]
          .map(toCsvValue)
          .join(",")
      );
    }

    const csv = lines.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="reclick-media-contacts.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Could not generate export." });
  }
});

module.exports = router;
