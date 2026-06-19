const Driver = require("../models/Driver");
const Order = require("../models/Order");

// كشف حساب سائق
const getDriverStatement = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const totalEarned = await Order.sum("driverEarning", {
      where: {
        DriverId: driverId,
        status: "DELIVERED",
      },
    });

    const remaining =
      (totalEarned || 0) -
      (driver.paidAmount || 0);

    res.json({
      driver,
      totalEarned: totalEarned || 0,
      paidAmount: driver.paidAmount || 0,
      remaining,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDriverStatement };