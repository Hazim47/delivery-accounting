const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  getDriverStatement,
} = require("../controllers/driverController");

// عرض كل السائقين
router.get(
  "/",
  authMiddleware,
  getDrivers
);

// كشف حساب سائق
router.get(
  "/:id/statement",
  authMiddleware,
  getDriverStatement
);

// إضافة سائق
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1"),
  createDriver
);

// تعديل سائق
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1"),
  updateDriver
);

// حذف سائق
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteDriver
);

module.exports = router;