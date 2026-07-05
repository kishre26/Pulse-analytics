const express = require("express");
const Site = require("../models/Site");
const Event = require("../models/Event");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const RANGE_TO_MS = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

// Confirms the requesting user actually owns the site before returning data
async function loadOwnedSite(siteId, userId) {
  return Site.findOne({ siteId, owner: userId });
}

router.get("/:siteId/summary", async (req, res) => {
  const { siteId } = req.params;
  const range = RANGE_TO_MS[req.query.range] ? req.query.range : "7d";
  const since = new Date(Date.now() - RANGE_TO_MS[range]);

  const site = await loadOwnedSite(siteId, req.userId);
  if (!site) return res.status(404).json({ message: "Site not found" });

  const match = { siteId, createdAt: { $gte: since } };

  const [totals, timeseries, topPages, topReferrers, browsers, devices] = await Promise.all([
    Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          pageviews: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
        },
      },
      { $project: { _id: 0, pageviews: 1, uniqueVisitors: { $size: "$uniqueVisitors" } } },
    ]),

    Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      { $project: { _id: 0, date: "$_id", pageviews: 1, visitors: { $size: "$visitors" } } },
      { $sort: { date: 1 } },
    ]),

    Event.aggregate([
      { $match: match },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, path: "$_id", views: 1 } },
    ]),

    Event.aggregate([
      { $match: match },
      {
        $project: {
          referrer: {
            $cond: [{ $eq: ["$referrer", ""] }, "Direct / None", "$referrer"],
          },
        },
      },
      { $group: { _id: "$referrer", visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, referrer: "$_id", visits: 1 } },
    ]),

    Event.aggregate([
      { $match: match },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, browser: "$_id", count: 1 } },
    ]),

    Event.aggregate([
      { $match: match },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, device: "$_id", count: 1 } },
    ]),
  ]);

  res.json({
    range,
    pageviews: totals[0]?.pageviews || 0,
    uniqueVisitors: totals[0]?.uniqueVisitors || 0,
    timeseries,
    topPages,
    topReferrers,
    browsers,
    devices,
  });
});

module.exports = router;
