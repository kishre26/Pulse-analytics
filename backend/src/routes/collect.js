const express = require("express");
const crypto = require("crypto");
const { UAParser } = require("ua-parser-js");
const Site = require("../models/Site");
const Event = require("../models/Event");

const router = express.Router();

// Builds a privacy-friendly, non-reversible visitor id.
// It rotates every day and is never stored alongside the raw IP, so no
// personal data is retained - it is only used to approximate "unique visitors".
function buildVisitorId(ip, userAgent, siteId) {
  const daySalt = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(`${ip}|${userAgent}|${siteId}|${daySalt}`)
    .digest("hex");
}

router.post("/", async (req, res) => {
  try {
    const { siteId, url, referrer } = req.body;
    if (!siteId || !url) {
      return res.status(400).json({ message: "siteId and url are required" });
    }

    const site = await Site.findOne({ siteId });
    if (!site) {
      return res.status(404).json({ message: "Unknown siteId" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
    const parsed = UAParser(userAgent);

    const parsedUrl = new URL(url);

    await Event.create({
      siteId,
      url,
      path: parsedUrl.pathname || "/",
      referrer: referrer || "",
      visitorId: buildVisitorId(ip, userAgent, siteId),
      browser: parsed.browser.name || "Unknown",
      os: parsed.os.name || "Unknown",
      device: parsed.device.type ? capitalize(parsed.device.type) : "Desktop",
    });

    // 204 keeps the beacon call cheap for the tracked page
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Could not record event", error: err.message });
  }
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;
