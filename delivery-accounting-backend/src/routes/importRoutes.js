const express =
  require("express");

const multer =
  require("multer");

const router =
  express.Router();

const {
  importOrdersExcel,
} = require(
  "../controllers/importController"
);

const {
  getImportLogs,
  deleteImportLog,
} = require(
  "../controllers/importLogController"
);

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/orders",
  upload.single("file"),
  importOrdersExcel
);

router.get(
  "/logs",
  getImportLogs
);

router.delete(
  "/logs/:id",
  deleteImportLog
);

module.exports = router;