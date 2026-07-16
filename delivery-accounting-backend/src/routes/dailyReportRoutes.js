const router = require("express").Router();

const {
 getDailyReports,
 getDailyReportsSummary
} = require("../controllers/dailyReportController");


router.get(
"/summary",
getDailyReportsSummary
);


router.get(
"/",
getDailyReports
);


module.exports = router;