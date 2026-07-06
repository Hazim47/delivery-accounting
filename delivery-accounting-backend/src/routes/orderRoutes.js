const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateOrderNotes,
  getOrderAudit, 
} = require("../controllers/orderController");

// ORDERS
router.get("/", authMiddleware, getOrders);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1", "EMPLOYEE"),
  createOrder
);
router.get(
  "/:id/audit",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getOrderAudit
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1"),
  updateOrderStatus
);
router.put(
  "/:id/notes",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "ACCOUNTANT_1",
    "ACCOUNTANT_2",
    "EMPLOYEE"
  ),
  updateOrderNotes
);

module.exports = router;