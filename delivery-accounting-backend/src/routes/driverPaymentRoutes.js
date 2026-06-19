const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createDriverPayment,
  getDriverPayments,
} = require(
  "../controllers/driverPaymentController"
);

router.post(
  "/",
  authMiddleware,
  createDriverPayment
);

router.get(
  "/:driverId",
  authMiddleware,
  getDriverPayments
);

module.exports = router;