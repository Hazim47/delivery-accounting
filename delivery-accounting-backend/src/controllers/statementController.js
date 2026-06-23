const { Op } = require("sequelize");

const Order = require("../models/Order");
const ImportLog = require("../models/ImportLog");

const getStatements = async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const offset =
      (page - 1) * limit;

    const { count, rows } =
      await ImportLog.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

    return res.json({
      total: count,
      page,
      pages: Math.ceil(
        count / limit
      ),
      data: rows,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({
        message:
          "Failed to fetch statements",
      });
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
        pages: Math.ceil(
          count / limit
        ),
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

const updateEmployeeNote =
  async (req, res) => {
    try {
      const order =
        await Order.findByPk(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      order.employeeNote =
        req.body.note || "";

      await order.save();

      return res.json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            "Failed to update note",
        });
    }
  };

const updateAccountantNote =
  async (req, res) => {
    try {
      const order =
        await Order.findByPk(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      order.accountantNote =
        req.body.note || "";

      await order.save();

      return res.json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            "Failed to update note",
        });
    }
  };
const toggleStatementLock = async (req, res) => {
  try {
    const statement = await ImportLog.findByPk(req.params.id);

    if (!statement) {
      return res.status(404).json({
        message: "Statement not found",
      });
    }

    statement.isLocked = !statement.isLocked;

    await statement.save();

    res.json(statement);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  getStatements,
  getStatementOrders,
  updateEmployeeNote,
  updateAccountantNote,
  toggleStatementLock,
};