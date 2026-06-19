const PDFDocument = require("pdfkit");

const generateReportPDF = (data, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=financial-report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(22).text("Financial Report", { align: "center" });

  doc.moveDown();

  doc.fontSize(14).text(`Total Orders: ${data.totalOrders}`);
  doc.text(`Delivered Orders: ${data.deliveredOrders}`);
  doc.text(`Total Profit: ${data.totalProfit} JD`);
  doc.text(`Total Expenses: ${data.totalExpenses} JD`);
  doc.text(`Net Profit: ${data.netProfit} JD`);

  doc.end();
};

module.exports = { generateReportPDF };