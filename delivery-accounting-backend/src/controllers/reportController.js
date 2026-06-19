const Order = require("../models/Order");
const Expense = require("../models/Expense");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { generateDailyReportPDF } = require("../services/pdfService");

// 📊 Daily Report (JSON + PDF ready)
const generateDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalSales =
      (await Order.sum("orderAmount", {
        where: {
          createdAt: { [Op.gte]: today },
          status: "DELIVERED",
        },
      })) || 0;

    const totalProfit =
      (await Order.sum("companyCommission", {
        where: {
          createdAt: { [Op.gte]: today },
          status: "DELIVERED",
        },
      })) || 0;

    const totalExpenses =
      (await Expense.sum("amount", {
        where: {
          createdAt: { [Op.gte]: today },
        },
      })) || 0;

    const netProfit = totalProfit - totalExpenses;

    const data = {
      totalSales,
      totalProfit,
      totalExpenses,
      netProfit,
    };

    const filePath = path.join(__dirname, "../../daily-report.pdf");

    await generateDailyReportPDF(data, filePath);

    // 👇 الأفضل: download مباشر
    return res.download(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  generateDailyReport,
};