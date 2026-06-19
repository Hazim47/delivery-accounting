const Order = require("../models/Order");

// تسجيل الدفع
const markAsPaid = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    await order.save();

    res.json({
      message: "Payment marked as paid",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { markAsPaid };