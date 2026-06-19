const sequelize = require("../config/database");

const ImportLog = require("../models/ImportLog");
const Order = require("../models/Order");
const Driver = require("../models/Driver");
const Restaurant = require("../models/Restaurant");

const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const deleteImportLog = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const log = await ImportLog.findByPk(req.params.id, {
      transaction,
    });

    if (!log) {
      return res.status(404).json({
        message: "Import not found",
      });
    }

    // =========================
    // 1. GET ALL ORDERS ONCE
    // =========================
    const orders = await Order.findAll({
      where: {
        ImportLogId: log.id,
      },
      transaction,
    });

    // cache drivers to avoid repeated queries
    const driverUpdates = {};

    for (const order of orders) {
      if (order.DriverId) {
        if (!driverUpdates[order.DriverId]) {
          const driver = await Driver.findByPk(order.DriverId, {
            transaction,
          });

          if (driver) {
            driverUpdates[order.DriverId] = driver;
          }
        }

        const driver = driverUpdates[order.DriverId];

        if (driver) {
          driver.totalEarnings =
            Number(driver.totalEarnings) -
            Number(order.driverEarning);

          await driver.save({ transaction });
        }
      }

      await order.destroy({ transaction });
    }

    // =========================
    // 2. CLEAN ORPHANS (FAST VERSION)
    // =========================

const driversWithoutOrders =
  await Driver.findAll({
    include: [
      {
        model: Order,
        attributes: ["id"],
        required: false,
      },
    ],
    transaction,
  });

for (const driver of driversWithoutOrders) {
  if (
    !driver.Orders ||
    driver.Orders.length === 0
  ) {
    await driver.destroy({
      transaction,
    });
  }
}

    const restaurants = await Restaurant.findAll({ transaction });

    for (const restaurant of restaurants) {
      const count = await Order.count({
        where: { RestaurantId: restaurant.id },
        transaction,
      });

      if (count === 0) {
        await restaurant.destroy({ transaction });
      }
    }

    await log.destroy({ transaction });

    await transaction.commit();

    return res.json({ success: true });
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    return res.status(500).json({
      message: "Delete failed",
    });
  }
};

module.exports = {
  getImportLogs,
  deleteImportLog,
};