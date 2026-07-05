const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth");
const siteRoutes = require("./src/routes/sites");
const collectRoutes = require("./src/routes/collect");
const statsRoutes = require("./src/routes/stats");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
const dashboardCors = cors({ origin: allowedOrigins });

app.use(express.json());
app.use(express.static("public"));

const collectLimiter = rateLimit({ windowMs: 60 * 1000, max: 300 });

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", dashboardCors, authRoutes);
app.use("/api/sites", dashboardCors, siteRoutes);
app.use("/api/collect", cors(), collectLimiter, collectRoutes);
app.use("/api/stats", dashboardCors, statsRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Pulse Analytics API running on port ${PORT}`));
});
