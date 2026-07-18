const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const driverSettlementRoutes = require("./routes/driverSettlementRoutes");
const restaurantStatementRoutes = require("./routes/restaurantStatementRoutes");
const advancedDashboardRoutes = require("./routes/advancedDashboardRoutes");
const chartsRoutes = require("./routes/chartsRoutes");
const importRoutes =require("./routes/importRoutes");
const dailyReportRoutes = require("./routes/dailyReportRoutes");
const statementRoutes =
  require("./routes/statementRoutes");
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true
   })
);
app.use(express.json());
app.use("/api/charts", chartsRoutes);
app.use("/api/import", importRoutes);
app.use("/api/advanced-dashboard", advancedDashboardRoutes);
app.use("/api/restaurant-statement", restaurantStatementRoutes);
app.use("/api/driver-settlement", driverSettlementRoutes);
app.use(
  "/api/statements",
  statementRoutes
);
app.use(
 "/api/daily-reports",
 dailyReportRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Delivery Accounting API Running",
  });
});

module.exports = app;