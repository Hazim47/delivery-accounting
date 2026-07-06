const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getDailyClosing,
} = require("../controllers/closingController");

router.get("/daily", authMiddleware, getDailyClosing);

module.exports = router;