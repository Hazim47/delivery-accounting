const { Op, fn, col, Sequelize } = require("sequelize");

const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");

/* =========================
   📅 CURRENT WEEK FILTER
   Sunday -> Saturday
========================= */
const getCurrentWeekFilter = () => {

  const now = new Date();

  // بداية الأسبوع الأحد
  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() - now.getDay()
  );
  startOfWeek.setHours(0,0,0,0);


  // نهاية الأسبوع السبت
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(
    startOfWeek.getDate() + 7
  );
  endOfWeek.setHours(0,0,0,0);


  return {
    [Op.gte]: startOfWeek,
    [Op.lt]: endOfWeek
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
        Order.count({
  where: {
   createdAt: getCurrentWeekFilter()
  }
}),
        Order.sum("companyCommission", {
  where: {
    status: "DELIVERED",
   createdAt: getCurrentWeekFilter()
  },
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
      orderStats,
    ] = await Promise.all([
      Restaurant.count(),

      Driver.count(),

     Order.findOne({
  where: {
    status: "DELIVERED",
   createdAt: getCurrentWeekFilter()
  },
  attributes: [
    [
      Sequelize.fn("COUNT", Sequelize.col("id")),
      "totalOrders",
    ],

    [
      Sequelize.fn(
        "COALESCE",
        Sequelize.fn("SUM", Sequelize.col("orderAmount")),
        0
      ),
      "totalRevenue",
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
        Sequelize.fn("SUM", Sequelize.col("companyCommission")),
        0
      ),
      "totalProfit",
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
  raw:true,
})
    ]);

    const totalRevenue = Number(orderStats.totalRevenue);
    const totalProfit = Number(orderStats.totalProfit);


    res.json({
      totalRestaurants,
      totalDrivers,
      totalOrders: Number(orderStats.totalOrders),
      totalRevenue,
      totalTariff: Number(orderStats.totalTariff),
      totalProfit,
      totalAccountingDepartment: Number(
        orderStats.totalAccountingDepartment
      ),
      netProfit:
        totalProfit,
    });
  } catch (error) {
    console.error(error);
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
};