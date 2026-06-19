const express =
  require("express");

const router =
  express.Router();

const {
  getStatements,
  getStatementOrders,
  updateEmployeeNote,
  updateAccountantNote,
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
  "/orders/:id/employee-note",
  updateEmployeeNote
);

router.put(
  "/orders/:id/accountant-note",
  updateAccountantNote
);

module.exports = router;