const { Op, fn, col, Sequelize } = require("sequelize");

const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");

/* =========================
   📅 CURRENT MONTH FILTER
========================= */
const getCurrentMonthFilter = () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return {
    [Op.gte]: startOfMonth,
  };
};
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
    const monthFilter = getCurrentMonthFilter();

    const stats = await Order.findOne({
      where: {
        orderDate: monthFilter,
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
  const monthFilter = getCurrentMonthFilter();
  try {
    const [
      totalRestaurants,
      totalDrivers,
      orderStats,
      totalExpenses,
      totalDriverPayments,
    ] = await Promise.all([
      Restaurant.count(),

      Driver.count(),

      Order.findOne({
        where: {
          status: "DELIVERED",
          orderDate: monthFilter,
        },
      attributes: [
  [
    Sequelize.fn("COUNT", Sequelize.col("id")),
    "totalOrders",
  ],
  [
    Sequelize.fn(
      "COALESCE",
      Sequelize.fn("SUM", Sequelize.col("tariff")),
      0
    ),
    "totalTariff",
  ],
  [
    Sequelize.fn(
      "COALESCE",
      Sequelize.fn("SUM", Sequelize.col("AccountingDepartment")),
      0
    ),
    "totalAccountingDepartment",
  ],
],
        raw: true,
      }),
    ]);

    const totalRevenue = Number(orderStats.totalRevenue);
    const totalProfit = Number(orderStats.totalProfit);

   res.json({
  totalRestaurants,
  totalDrivers,
  totalOrders: Number(orderStats.totalOrders),
  totalTariff: Number(orderStats.totalTariff),
  totalAccountingDepartment: Number(
    orderStats.totalAccountingDepartment
  ),
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* =========================
   📊 REVENUE CHART
========================= */
const getRevenueChart = async (req, res) => {
  const monthFilter = getCurrentMonthFilter();

  try {
    const data = await Order.findAll({
      where: {
        status: "DELIVERED",
        orderDate: monthFilter,
      },

      attributes: [
        [
          Sequelize.fn(
            "TO_CHAR",
            Sequelize.col("orderDate"),
            "DD"
          ),
          "date",
        ],

        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.col("AccountingDepartment")
            ),
            0
          ),
          "accounting",
        ],

        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.col("tariff")
            ),
            0
          ),
          "tariff",
        ],
      ],

      group: [
        Sequelize.fn(
          "TO_CHAR",
          Sequelize.col("orderDate"),
          "DD"
        ),
      ],

      order: [
        [
          Sequelize.fn(
            "MIN",
            Sequelize.col("orderDate")
          ),
          "ASC",
        ],
      ],

      raw: true,
    });

    res.json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
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