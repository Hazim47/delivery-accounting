const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  importOrdersExcel,
} = require("../controllers/importController");

const {
  getImportLogs,
  deleteImportLog,
} = require("../controllers/importLogController");
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    // 🔥 أقوى fix للعربي
    const decodedName = Buffer.from(file.originalname, "latin1").toString("utf8");

    cb(null, `${Date.now()}-${decodedName}`);
  },
});

const upload = multer({
  storage,

  // 🔥 مهم جداً لبعض الحالات
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, true);
  },
});

router.post(
  "/orders",
  upload.single("file"),
  importOrdersExcel
);
router.delete(
  "/logs/:id",
  authMiddleware,
  deleteImportLog
);

router.get("/logs", getImportLogs);


module.exports = router;