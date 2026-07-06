const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getRestaurantStatement,
} = require("../controllers/restaurantStatementController");

router.get("/:restaurantId", authMiddleware, getRestaurantStatement);

module.exports = router;