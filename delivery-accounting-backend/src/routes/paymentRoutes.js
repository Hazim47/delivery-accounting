const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  markAsPaid,
} = require("../controllers/paymentController");

router.put("/:orderId/pay", authMiddleware, markAsPaid);

module.exports = router;