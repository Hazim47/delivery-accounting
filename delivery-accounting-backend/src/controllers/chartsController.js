const Order = require("../models/Order");
const { fn, col } = require("sequelize");

// Sales & Tariff Chart (FIXED)
const getRevenueChart = async (req, res) => {
  try {
    const data = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],

        [fn("SUM", col("orderAmount")), "sales"],

        [fn("SUM", col("tariff")), "tariff"],
      ],

      where: {
        status: "DELIVERED",
      },

      group: ["date"],

      order: [["date", "ASC"]],

      raw: true,
    });

    // تنظيف البيانات
    const clean = data.map((item) => ({
      date: item.date,
      sales: Number(item.sales) || 0,
      tariff: Number(item.tariff) || 0,
    }));
console.log(await Order.findAll({ raw: true }));
    res.json(clean);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getRevenueChart };