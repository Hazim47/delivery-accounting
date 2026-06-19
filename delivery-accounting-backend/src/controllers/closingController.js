const { Op } = require("sequelize");
const Order = require("../models/Order");
const Expense = require("../models/Expense");

const getDailyClosing = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: today },
        status: "DELIVERED",
      },
    });

    const expenses = await Expense.sum("amount", {
      where: {
        createdAt: { [Op.gte]: today },
      },
    });

    const totalSales = orders.reduce(
      (sum, o) => sum + Number(o.orderAmount),
      0
    );

    const totalProfit = orders.reduce(
      (sum, o) => sum + Number(o.companyCommission),
      0
    );

    const netProfit = totalProfit - (expenses || 0);

    res.json({
      totalSales,
      totalProfit,
      totalExpenses: expenses || 0,
      netProfit,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDailyClosing };