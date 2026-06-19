const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTopDrivers,
  getTopRestaurants,
} = require("../controllers/advancedDashboardController");

router.get("/top-drivers", authMiddleware, getTopDrivers);
router.get("/top-restaurants", authMiddleware, getTopRestaurants);

module.exports = router;