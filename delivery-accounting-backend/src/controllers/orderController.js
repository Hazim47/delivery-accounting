const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");
const User = require("../models/User");
const { createAuditLog } = require("../utils/audit");
const AuditLog = require("../models/AuditLog");
const ImportLog = require("../models/ImportLog");

/* =========================================================
   CREATE ORDER
========================================================= */
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      orderAmount,
      deliveryFee,
      restaurantId,
      driverId,
    } = req.body;

    const [restaurant, driver] = await Promise.all([
      Restaurant.findByPk(restaurantId),
      Driver.findByPk(driverId),
    ]);

    if (!restaurant || !driver) {
      return res.status(404).json({
        message: "Restaurant or Driver not found",
      });
    }

    const commissionRate = restaurant.commissionRate || 10;

    const companyCommission =
      (Number(orderAmount) * commissionRate) / 100;

    const restaurantEarning =
      Number(orderAmount) - companyCommission;

    const driverEarning = Number(deliveryFee || 0);

    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      orderAmount,
      deliveryFee: driverEarning,
      companyCommission,
      restaurantEarning,
      driverEarning,
      RestaurantId: restaurantId,
      DriverId: driverId,
      status: "PENDING",

      ImportLogId: req.body.ImportLogId || null, // 🔥 مهم
    });

    res.status(201).json({
      message: "Order created",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   GET AUDIT
========================================================= */
const getOrderAudit = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await AuditLog.findAll({
      where: { orderId: id },
      order: [["createdAt", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   GET ORDERS
========================================================= */
const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await Order.findAndCountAll({
      distinct: true,
      include: [
        {
          association: "Restaurant",
          attributes: ["id", "name"],
        },
        {
          association: "Driver",
          attributes: ["id", "fullName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   UPDATE STATUS
========================================================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 FIX: حماية القفل بشكل صحيح
    if (order.ImportLogId) {
      const statement = await ImportLog.findByPk(order.ImportLogId);

      if (statement?.isLocked === true) {
        return res.status(403).json({
          message: "Statement is locked. Cannot update status.",
        });
      }
    }

    const oldStatus = order.status;

    const isFirstDelivery =
      status === "DELIVERED" &&
      oldStatus !== "DELIVERED";

    if (isFirstDelivery) {
      const driver = await Driver.findByPk(order.DriverId);

      if (driver) {
        driver.totalEarnings =
          Number(driver.totalEarnings || 0) +
          Number(order.driverEarning || 0);

        await driver.save();
      }
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   UPDATE NOTES + FIELDS
========================================================= */
const updateOrderNotes = async (req, res) => {
  console.log("UPDATE NOTES HIT");

  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 🔥 FIX: حماية القفل (100% مضمونة)
    if (order.ImportLogId) {
      const statement = await ImportLog.findByPk(order.ImportLogId);

      if (statement?.isLocked === true) {
        return res.status(403).json({
          message: "Statement is locked. Editing is not allowed.",
        });
      }
    }

    const role = req.user.role;
    const user = await User.findByPk(req.user.id);

    const fieldPermissions = {
      EMPLOYEE: [
        "employeeNote",
        "customerName",
        "customerPhone",
        "invoiceNumber",
      ],
      ACCOUNTANT_1: [
        "accountantNote",
        "commissionDescription",
      ],
      ACCOUNTANT_2: [
        "accountantNote",
        "commissionDescription",
      ],
      ADMIN: [
        "employeeNote",
        "accountantNote",
        "customerName",
        "customerPhone",
        "invoiceNumber",
        "commissionDescription",
      ],
    };

    const allowedFields = fieldPermissions[role] || [];

    for (const field of allowedFields) {
      if (field in req.body) {
        const oldValue = order[field];

        order[field] = req.body[field];

        await createAuditLog({
          orderId: order.id,
          user,
          action: `UPDATE_${field.toUpperCase()}`,
          field,
          oldValue,
          newValue: order[field],
        });
      }
    }

    await order.save();

    res.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ========================================================= */

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateOrderNotes,
  getOrderAudit,
};