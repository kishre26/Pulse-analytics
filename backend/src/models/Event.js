const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    siteId: { type: String, required: true, index: true },
    type: { type: String, enum: ["pageview"], default: "pageview" },
    url: { type: String, required: true },
    path: { type: String, required: true },
    referrer: { type: String, default: "" },
    visitorId: { type: String, required: true, index: true },
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    device: { type: String, default: "Desktop" },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Compound index used by most of the aggregation queries in stats routes
eventSchema.index({ siteId: 1, createdAt: -1 });

module.exports = mongoose.model("Event", eventSchema);
