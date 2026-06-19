const Order = require("../models/Order");
const { fn, col } = require("sequelize");

// Revenue Chart
const getRevenueChart = async (req, res) => {
  try {
    const data = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("orderAmount")), "total"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getRevenueChart };