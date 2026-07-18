const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getDailyStats,
  getMonthlyStats,
  getGeneralStats,
  getOverviewStats,
} = require("../controllers/dashboardController");

router.get("/daily", authMiddleware, getDailyStats);
router.get("/monthly", authMiddleware, getMonthlyStats);
router.get("/general", authMiddleware, getGeneralStats);
router.get("/overview", authMiddleware, getOverviewStats);

module.exports = router;