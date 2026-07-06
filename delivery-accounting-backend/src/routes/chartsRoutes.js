const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getRevenueChart,
} = require("../controllers/chartsController");

router.get("/revenue", authMiddleware, getRevenueChart);

module.exports = router;