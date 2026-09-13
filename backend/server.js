require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const contactRoute = require("./routes/contact");
const exportRoute = require("./routes/export");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "*",
  })
);

// >>> YOUR DATABASE CONNECTION <<<
// Reads MONGODB_URI from .env — see .env.example
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/contact", contactRoute);
app.use("/api/contact", exportRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Reclick Media backend running on http://localhost:${PORT}`);
});
