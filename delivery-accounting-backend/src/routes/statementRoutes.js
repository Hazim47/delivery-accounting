const express =
  require("express");

const router =
  express.Router();

const {
  getStatements,
  getStatementOrders,
  updateEmployeeNote,
  updateAccountantNote,
  toggleStatementLock,
} = require(
  "../controllers/statementController"
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
  toggleStatementLock
);
router.put(
  "/orders/:id/employee-note",
  updateEmployeeNote
);

router.put(
  "/orders/:id/accountant-note",
  updateAccountantNote
);

module.exports = router;