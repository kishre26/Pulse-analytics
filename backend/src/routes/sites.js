const express = require("express");
const Site = require("../models/Site");
const Event = require("../models/Event");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// List all sites owned by the logged-in user
router.get("/", async (req, res) => {
  const sites = await Site.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json(sites);
});

// Register a new site to track
router.post("/", async (req, res) => {
  try {
    const { name, domain } = req.body;
    if (!name || !domain) {
      return res.status(400).json({ message: "Name and domain are required" });
    }
    const site = await Site.create({ name, domain, owner: req.userId });
    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: "Could not create site", error: err.message });
  }
});

// Remove a site and all of its collected events
router.delete("/:id", async (req, res) => {
  const site = await Site.findOne({ _id: req.params.id, owner: req.userId });
  if (!site) return res.status(404).json({ message: "Site not found" });

  await Event.deleteMany({ siteId: site.siteId });
  await site.deleteOne();
  res.json({ message: "Site deleted" });
});

module.exports = router;
