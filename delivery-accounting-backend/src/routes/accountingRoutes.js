const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNetProfit,
} = require("../controllers/accountingController");

router.get("/net-profit", authMiddleware, getNetProfit);

module.exports = router;