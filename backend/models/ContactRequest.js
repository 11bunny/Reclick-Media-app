const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    contentType: { type: String },
    date: { type: String },
    message: { type: String },
    status: { type: String, default: "new" }, // new | contacted | booked | closed
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
