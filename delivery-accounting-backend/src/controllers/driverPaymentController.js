const Driver = require("../models/Driver");
const DriverPayment = require("../models/DriverPayment");
const AuditLog = require("../models/AuditLog");

// إنشاء دفعة
const createDriverPayment = async (req, res) => {
  try {
    const { driverId, amount, note } = req.body;

    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const remaining =
      Number(driver.totalEarnings || 0) -
      Number(driver.paidAmount || 0);

    if (Number(amount) > remaining) {
      return res.status(400).json({
        message: "Payment exceeds remaining balance",
      });
    }

    const payment = await DriverPayment.create({
      DriverId: driverId,
      amount,
      note,
    });

    await AuditLog.create({
      action: "CREATE_DRIVER_PAYMENT",
      entity: "Driver",
      entityId: driver.id,
      details: JSON.stringify({ amount, note }),
    });

    driver.paidAmount =
      Number(driver.paidAmount || 0) + Number(amount);

    await driver.save();

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// جلب دفعات سائق
const getDriverPayments = async (req, res) => {
  try {
    const { driverId } = req.params;

    const payments = await DriverPayment.findAll({
      where: { DriverId: driverId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "amount", "note", "createdAt"],
    });

    res.json(payments);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createDriverPayment,
  getDriverPayments,
};