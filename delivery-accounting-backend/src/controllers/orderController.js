const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");
const User = require("../models/User");
const { createAuditLog } = require("../utils/audit");
const AuditLog = require("../models/AuditLog");
// إنشاء طلب (optimized)
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
// جلب الطلبات
const getOrders = async (req, res) => {
  try {
   const page = Number(req.query.page) || 1;
const limit =
  Math.min(Number(req.query.limit) || 50, 100);

const offset = (page - 1) * limit;

const { rows, count } =
  await Order.findAndCountAll({
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
  orders: rows,
});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// تحديث الحالة (NO double earnings bug)
const updateOrderStatus = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
  const oldEmployeeNote = order.employeeNote;
const oldAccountantNote = order.accountantNote;
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
const updateOrderNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const role = req.user.role;

    // 👇 هان بنجيب المستخدم بعد ما نتأكد order موجود
    const user = await User.findByPk(req.user.id);

   if (role === "EMPLOYEE") {
  if ("employeeNote" in req.body) {

    const oldValue = order.employeeNote;

    order.employeeNote = req.body.employeeNote || "";
    order.employeeNoteBy = user.fullName;
    order.employeeNoteAt = new Date();

    await createAuditLog({
      orderId: order.id,
      user,
      action: "UPDATE_EMPLOYEE_NOTE",
      field: "employeeNote",
      oldValue,
      newValue: order.employeeNote,
    });
  }
}

   else if (
  role === "ACCOUNTANT_1" ||
  role === "ACCOUNTANT_2"
) {
  if ("accountantNote" in req.body) {

    const oldValue = order.accountantNote;

    order.accountantNote = req.body.accountantNote || "";
    order.accountantNoteBy = user.fullName;
    order.accountantNoteAt = new Date();

    await createAuditLog({
      orderId: order.id,
      user,
      action: "UPDATE_ACCOUNTANT_NOTE",
      field: "accountantNote",
      oldValue,
      newValue: order.accountantNote,
    });
  }
}

  if (role === "ADMIN") {

  if ("employeeNote" in req.body) {
    const oldValue = order.employeeNote;

    order.employeeNote = req.body.employeeNote || "";
    order.employeeNoteBy = req.user.fullName;
    order.employeeNoteAt = new Date();

    await createAuditLog({
      orderId: order.id,
      user: req.user,
      action: "UPDATE_EMPLOYEE_NOTE",
      field: "employeeNote",
      oldValue,
      newValue: order.employeeNote,
    });
  }

  if ("accountantNote" in req.body) {
    const oldValue = order.accountantNote;

    order.accountantNote = req.body.accountantNote || "";
    order.accountantNoteBy = req.user.fullName;
    order.accountantNoteAt = new Date();

    await createAuditLog({
      orderId: order.id,
      user: req.user,
      action: "UPDATE_ACCOUNTANT_NOTE",
      field: "accountantNote",
      oldValue,
      newValue: order.accountantNote,
    });
  }
}

    console.log("ROLE:", role);
    console.log("BODY:", req.body);
    console.log(req.user);

    await order.save();

    res.json({
      message: "Notes updated",
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