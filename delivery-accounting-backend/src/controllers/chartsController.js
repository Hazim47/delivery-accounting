const Order = require("../models/Order");
const { fn, col } = require("sequelize");

// Accounting Department & Tariff Chart
const getRevenueChart = async (req, res) => {
  try {
    const data = await Order.findAll({
      attributes: [
        [
          fn("DATE", col("createdAt")),
          "date",
        ],

        [
          fn("SUM", col("AccountingDepartment")),
          "accounting",
        ],

        [
          fn("SUM", col("tariff")),
          "tariff",
        ],
      ],

      where: {
        status: "DELIVERED",
      },

      group: [
        fn("DATE", col("createdAt")),
      ],

      order: [
        [fn("DATE", col("createdAt")), "ASC"],
      ],

      raw: true,
    });


    const clean = data.map((item) => ({
      date: item.date,
      accounting: Number(item.accounting) || 0,
      tariff: Number(item.tariff) || 0,
    }));


    res.json(clean);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = { getRevenueChart };