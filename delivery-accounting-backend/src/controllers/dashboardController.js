const { Op, fn, col, Sequelize } = require("sequelize");

const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");
const Expense = require("../models/Expense");
const DriverPayment = require("../models/DriverPayment");

/* =========================
   📊 DAILY STATS
========================= */
const getDailyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Order.findOne({
      where: {
        orderDate: { [Op.gte]: today },
        status: "DELIVERED",
      },
      attributes: [
        [
          fn("COALESCE", fn("SUM", col("companyCommission")), 0),
          "totalCompanyProfit",
        ],
        [
          fn("COALESCE", fn("SUM", col("orderAmount")), 0),
          "totalSales",
        ],
      ],
      raw: true,
    });

    res.json(
      stats || {
        totalCompanyProfit: 0,
        totalSales: 0,
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   📊 MONTHLY STATS
========================= */
const getMonthlyStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const stats = await Order.findOne({
      where: {
        orderDate: { [Op.gte]: startOfMonth },
        status: "DELIVERED",
      },
      attributes: [
        [
          fn("COALESCE", fn("SUM", col("companyCommission")), 0),
          "totalCompanyProfit",
        ],
        [
          fn("COALESCE", fn("SUM", col("orderAmount")), 0),
          "totalSales",
        ],
      ],
      raw: true,
    });

    res.json(
      stats || {
        totalCompanyProfit: 0,
        totalSales: 0,
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   📊 GENERAL STATS
========================= */
const getGeneralStats = async (req, res) => {
  try {
    const [totalRestaurants, totalDrivers, totalOrders, totalProfit] =
      await Promise.all([
        Restaurant.count(),
        Driver.count(),
        Order.count(),
        Order.sum("companyCommission", {
          where: { status: "DELIVERED" },
        }),
      ]);

    res.json({
      totalRestaurants,
      totalDrivers,
      totalOrders,
      
      totalProfit: totalProfit || 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   📊 OVERVIEW DASHBOARD
========================= */
const getOverviewStats = async (req, res) => {
  try {
   const [
  totalRestaurants,
  totalDrivers,
  totalOrders,
  totalRevenue,
  totalTariff,
  totalProfit,
  totalExpenses,
  totalDriverPayments,
  totalAccountingDepartment,
] = await Promise.all([
  Restaurant.count(),
  Driver.count(),
  Order.count(),

  Order.sum("orderAmount", {
    where: { status: "DELIVERED" },
  }),

  Order.sum("tariff", {
    where: { status: "DELIVERED" },
  }),

  Order.sum("companyCommission", {
    where: { status: "DELIVERED" },
  }),

  Expense.sum("amount"),

  DriverPayment.sum("amount"),

 Order.sum("AccountingDepartment", {
  where: {
    status: "DELIVERED",
  },
}),
]);

    const revenue = totalRevenue || 0;
    const profit = totalProfit || 0;
    const expenses = totalExpenses || 0;
    const driverPayments = totalDriverPayments || 0;

    const netProfit = profit - expenses - driverPayments;

    res.json({
      totalOrders,
      totalDrivers,
      totalRestaurants,
      totalRevenue: revenue,
      totalExpenses: expenses,
      totalProfit: profit,
      totalDriverPayments: driverPayments,
      totalAccountingDepartment:
  totalAccountingDepartment || 0,
    totalTariff: totalTariff || 0,
      netProfit,
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   📊 REVENUE CHART
========================= */
const getRevenueChart = async (req, res) => {
  try {
    const data = await Order.findAll({
      where: { status: "DELIVERED" },
      attributes: [
        [
          Sequelize.fn(
            "TO_CHAR",
            Sequelize.col("orderDate"),
            "Mon"
          ),
          "month",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("orderAmount")),
          "revenue",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("companyCommission")),
          "profit",
        ],
      ],
      group: [
        Sequelize.fn("TO_CHAR", Sequelize.col("orderDate"), "Mon"),
      ],
      order: [
        [
          Sequelize.fn("MIN", Sequelize.col("orderDate")),
          "ASC",
        ],
      ],
      raw: true,
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   EXPORT
========================= */
module.exports = {
  getDailyStats,
  getMonthlyStats,
  getGeneralStats,
  getOverviewStats,
  getRevenueChart,
};