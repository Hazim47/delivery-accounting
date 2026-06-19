const Driver = require("../models/Driver");
const Order = require("../models/Order");

// إضافة سائق
const createDriver = async (req, res) => {
  try {
    const { fullName, phone, vehicleType } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "fullName required" });
    }

    const driver = await Driver.create({
      fullName,
      phone,
      vehicleType,
      active: true,
      totalEarnings: 0,
      paidAmount: 0,
    });

    res.status(201).json(driver);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// جلب كل السائقين (FAST)
const getDrivers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit =
      Math.min(Number(req.query.limit) || 50, 100);

    const offset = (page - 1) * limit;

    const { rows, count } =
      await Driver.findAndCountAll({
        attributes: [
          "id",
          "fullName",
          "phone",
          "vehicleType",
          "active",
          "totalEarnings",
          "paidAmount",
          "createdAt",
        ],

        order: [["createdAt", "DESC"]],

        limit,
        offset,
      });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      drivers: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// كشف حساب سائق (Unified source)
const getDriverStatement = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const totalEarned = await Order.sum("driverEarning", {
      where: { DriverId: id, status: "DELIVERED" },
    });

    const paidAmount = Number(driver.paidAmount || 0);

    const remaining =
      (totalEarned || 0) - paidAmount;

    res.json({
      id: driver.id,
      fullName: driver.fullName,
      totalEarned: totalEarned || 0,
      paidAmount,
      remaining,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// تعديل سائق
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Not found" });
    }

    await driver.update(req.body);

    res.json({
      message: "Updated successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// حذف سائق
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ message: "Not found" });
    }

    await driver.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  getDriverStatement,
};