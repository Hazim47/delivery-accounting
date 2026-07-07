const { Op } = require("sequelize");

const Order = require("../models/Order");
const ImportLog = require("../models/ImportLog");

const getStatements = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const search = (req.query.search || "").trim();

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          fileName: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];

      // إذا المستخدم كتب سنة مثل 2026
      if (/^\d{4}$/.test(search)) {
        where.createdAt = {
          [Op.gte]: new Date(`${search}-01-01`),
          [Op.lt]: new Date(`${Number(search) + 1}-01-01`),
        };
      }
    }

    const { count, rows } = await ImportLog.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: rows,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch statements",
    });
  }
};
const updateOrderField = async (req, res) => {
  try {
    const result = await checkIfLocked(
    req.params.id,
    req.user
);

    if (result.error === "not_found") {
      return res.status(404).json({ message: "Order not found" });
    }
    if (result.error === "locked") {
      return res.status(403).json({ message: "Statement is locked (read-only mode)" });
    }

    const field = Object.keys(req.body)[0];

    // تحقق الصلاحية بالباك مش بس بالفرونت
    if (req.user?.role !== "ADMIN") {
      const allowed = req.user?.permissions?.[field] === true;
      if (!allowed) {
        return res.status(403).json({ message: "لا تملك صلاحية تعديل هذا الحقل" });
      }
    }

    const order = result.order;
    order[field] = req.body[field];
    await order.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};
const getStatementOrders =
  async (req, res) => {
    try {
      const { id } = req.params;

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) ||
        100;

      const offset =
        (page - 1) * limit;

      const search =
        req.query.search || "";

      const where = {
        ImportLogId: id,
      };

      if (search) {
        where[Op.or] = [
          {
            customerName: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            customerPhone: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            externalOrderId: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            restaurantName: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            captainName: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ];
      }
const statement = await ImportLog.findByPk(id);

if (!statement) {
  return res.status(404).json({
    message: "Statement not found",
  });
}
      const {
        count,
        rows,
      } =
        await Order.findAndCountAll({
          where,
          order: [
            ["createdAt", "DESC"],
          ],
          limit,
          offset,
        });

  return res.json({
  total: count,
  page,
  pages: Math.ceil(count / limit),
  isLocked: statement.isLocked,
  data: rows,
});
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            "Failed to fetch orders",
        });
    }
  };
const checkIfLocked = async (orderId, user) => {
  const order = await Order.findByPk(orderId);

  if (!order) return { error: "not_found" };

  const statement = await ImportLog.findByPk(order.ImportLogId);

  if (statement?.isLocked && user.role !== "ADMIN") {
    return { error: "locked" };
  }

  return { order };
};
const updateEmployeeNote = async (req, res) => {
  try {
    const order = req.order;

    order.employeeNote = req.body.note || "";
    await order.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update note" });
  }
};
const updateAccountantNote = async (req, res) => {
  try {
    const order = req.order;

    order.accountantNote = req.body.note || "";
    await order.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to update note" });
  }
};
const checkStatementLocked = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const statement = await ImportLog.findByPk(order.ImportLogId);

   if (
    statement?.isLocked &&
    req.user.role !== "ADMIN"
) {
    return res.status(403).json({
        message: "Statement is locked"
    });
}

    req.order = order;
    req.statement = statement;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const toggleStatementLock = async (req, res) => {
  try {
     console.log(req.user);
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "غير مصرح، للأدمن فقط" });
    }

    const statement = await ImportLog.findByPk(req.params.id);

    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }

    statement.isLocked = !statement.isLocked;
    await statement.save();

    res.json(statement);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const createOrderInStatement = async (req, res) => {
  try {
    const { statementId } = req.params;

    const statement = await ImportLog.findByPk(statementId);

    if (!statement) {
      return res.status(404).json({
        message: "Statement not found",
      });
    }

    // إذا الملف مقفل لا يستطيع إلا الأدمن
    if (statement.isLocked && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Statement is locked",
      });
    }

    const order = await Order.create({
      ImportLogId: statementId,

      customerName: "",
      customerPhone: "",
      customerAddress: "",

      orderAmount: 0,
      deliveryFee: 0,
      companyCommission: 0,
      restaurantEarning: 0,
      driverEarning: 0,

      externalOrderId: "",

      orderDate: null,
      startTime: null,
      endTime: null,

      restaurantName: "",
      branchName: "",
      captainName: "",
      captainPhone: "",

      tariff: 0,
      customerAreaInput: "",

      vehicleType: "",

      distance: 0,

      invoiceNumber: null,

      commissionDescription: "",

      cancelReason: "",

      employeeNote: "",
      accountantNote: "",

      status: "DELIVERED",
    });

    res.status(201).json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
/* ========================================================= */
module.exports = {
  getStatements,
  getStatementOrders,
  updateEmployeeNote,
  updateAccountantNote,
  toggleStatementLock,
  updateOrderField ,
  checkStatementLocked,
  createOrderInStatement,
};