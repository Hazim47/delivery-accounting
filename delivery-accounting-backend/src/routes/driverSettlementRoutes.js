const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDriverStatement,
} = require("../controllers/driverSettlementController");

router.get("/:driverId", authMiddleware, getDriverStatement);

module.exports = router;