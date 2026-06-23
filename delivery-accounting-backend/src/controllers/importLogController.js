const sequelize = require("../config/database");
const { Op } = require("sequelize");

const ImportLog = require("../models/ImportLog");
const Order = require("../models/Order");
const Driver = require("../models/Driver");
const Restaurant = require("../models/Restaurant");

/**
 * GET IMPORT LOGS
 */
const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE IMPORT LOG (OPTIMIZED VERSION)
 */
const deleteImportLog = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const logId = req.params.id;

    // 1️⃣ GET LOG
    const log = await ImportLog.findByPk(logId, { transaction });

    if (!log) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Import not found",
      });
    }

    // 2️⃣ GET ONLY NEEDED DATA (NO HEAVY INCLUDE)
    const orders = await Order.findAll({
      where: { ImportLogId: log.id },
      transaction,
      attributes: ["id", "DriverId", "driverEarning", "RestaurantId"],
    });

    // 3️⃣ AGGREGATE DRIVER EARNINGS (FAST)
    const driverEarningsMap = {};

    for (const order of orders) {
      if (!order.DriverId) continue;

      driverEarningsMap[order.DriverId] =
        (driverEarningsMap[order.DriverId] || 0) +
        Number(order.driverEarning || 0);
    }

    // 4️⃣ BULK UPDATE DRIVERS (NO LOOPS WITH SAVE)
    const driverIds = Object.keys(driverEarningsMap);

    for (const driverId of driverIds) {
      await Driver.decrement(
        { totalEarnings: driverEarningsMap[driverId] },
        { where: { id: driverId }, transaction }
      );
    }

    // 5️⃣ DELETE ORDERS IN ONE QUERY
    await Order.destroy({
      where: { ImportLogId: log.id },
      transaction,
    });

    // 6️⃣ CLEAN ORPHAN DRIVERS (SAFE + FAST)
    await Driver.destroy({
      where: {
        id: {
          [Op.notIn]: sequelize.literal(`
            (SELECT DISTINCT "DriverId"
             FROM "Orders"
             WHERE "DriverId" IS NOT NULL)
          `),
        },
      },
      transaction,
    });

    // 7️⃣ CLEAN ORPHAN RESTAURANTS
    await Restaurant.destroy({
      where: {
        id: {
          [Op.notIn]: sequelize.literal(`
            (SELECT DISTINCT "RestaurantId"
             FROM "Orders"
             WHERE "RestaurantId" IS NOT NULL)
          `),
        },
      },
      transaction,
    });

    // 8️⃣ DELETE IMPORT LOG
    await ImportLog.destroy({
      where: { id: log.id },
      transaction,
    });

    // 9️⃣ COMMIT
    await transaction.commit();

    return res.json({
      success: true,
      message: "Import deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("DELETE IMPORT ERROR:", error);

    return res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  getImportLogs,
  deleteImportLog,
};