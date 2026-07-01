const express =
  require("express");

const router =
  express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStatements,
  getStatementOrders,
  updateEmployeeNote,
  updateAccountantNote,
  toggleStatementLock,
  checkStatementLocked,
  updateOrderField
} = require(
  "../controllers/statementController"
);
router.put(
  "/orders/:id/employee-note",
  checkStatementLocked,
  updateEmployeeNote
);

router.put(
  "/orders/:id/accountant-note",
  checkStatementLocked,
  updateAccountantNote
);

router.put(
  "/orders/:id",
  authMiddleware,
  checkStatementLocked,
  updateOrderField
);
router.get(
  "/",
  getStatements
);

router.get(
  "/:id/orders",
  getStatementOrders
);
router.put(
  "/:id/toggle-lock",
  authMiddleware,
  toggleStatementLock
);

router.put(
  "/orders/:id/employee-note",
  authMiddleware,
  checkStatementLocked,
  updateEmployeeNote
);

router.put(
  "/orders/:id/accountant-note",
  authMiddleware,
  checkStatementLocked,
  updateAccountantNote
);

module.exports = router;