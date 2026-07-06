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
    const orders = await Order.findAll({
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

      order: [
        ["orderDate", "ASC"],
        ["startTime", "ASC"],
        ["endTime", "ASC"],
      ],
    });

    res.json({
      data: orders,
    });
  } catch (error) {
    console.log(error);
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

    // منع التعديل إذا كان الستيتمنت مقفل
 if (order.ImportLogId) {
  const statement = await ImportLog.findByPk(order.ImportLogId);

  if (statement?.isLocked && req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Statement is locked. Editing is not allowed.",
    });
  }
}

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("BODY:", req.body);
    console.log("ROLE:", user.role);
    console.log("PERMISSIONS:", user.permissions);

    // الأدمن يستطيع تعديل كل شيء
    let allowedFields = [];

    if (user.role === "ADMIN") {
      allowedFields = Object.keys(req.body);
    } else {
      allowedFields = Object.keys(user.permissions || {}).filter(
        (field) => user.permissions[field] === true
      );
    }

    console.log("Allowed Fields:", allowedFields);

    for (const field of allowedFields) {
      if (!(field in req.body)) continue;

      const oldValue = order[field];
      const newValue = req.body[field];

      // إذا القيمة لم تتغير لا تحفظ
      if (oldValue === newValue) continue;

      order[field] = newValue;

      await createAuditLog({
        orderId: order.id,
        user,
        action: `UPDATE_${field.toUpperCase()}`,
        field,
        oldValue,
        newValue,
      });
    }

    await order.save();

    console.log("ORDER SAVED");

    res.json({
      message: "Order updated successfully",
      order,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateOrderNotes,
  getOrderAudit,
};