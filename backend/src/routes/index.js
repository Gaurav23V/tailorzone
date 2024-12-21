const express = require("express");
const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
