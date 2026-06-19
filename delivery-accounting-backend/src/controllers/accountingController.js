const Order = require("../models/Order");
const Expense = require("../models/Expense");

// صافي الربح الحقيقي
const getNetProfit = async (req, res) => {
  try {
    const totalProfit = await Order.sum("companyCommission", {
      where: { status: "DELIVERED" },
    });

    const totalExpenses = await Expense.sum("amount");

    const netProfit = (totalProfit || 0) - (totalExpenses || 0);

    res.json({
      totalProfit,
      totalExpenses,
      netProfit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getNetProfit };