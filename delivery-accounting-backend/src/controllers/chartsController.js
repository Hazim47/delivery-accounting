const Order = require("../models/Order");
const { Op, fn, col, Sequelize } = require("sequelize");

const getCurrentWeekFilter = () => {
  const now = new Date();

  const day = now.getDay(); // Sunday = 0

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - day);
  startOfWeek.setHours(0,0,0,0);

  return {
    [Op.gte]: startOfWeek,
  };
};
const getRevenueChart = async (req, res) => {
  try {
    const data = await Order.findAll({
where:{
 status:"DELIVERED",
createdAt:getCurrentWeekFilter()
},

      attributes: [
        [
          Sequelize.fn(
            "TO_CHAR",
            Sequelize.col("orderDate"),
            "Mon"
          ),
          "date",
        ],

        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.col("AccountingDepartment")
            ),
            0
          ),
          "accounting",
        ],

        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.col("tariff")
            ),
            0
          ),
          "tariff",
        ],
      ],

      group: [
        Sequelize.fn(
          "TO_CHAR",
          Sequelize.col("orderDate"),
          "Mon"
        ),
      ],

      order: [
        [
          Sequelize.fn(
            "MIN",
            Sequelize.col("orderDate")
          ),
          "ASC",
        ],
      ],

      raw: true,
    });


  

    res.json(data);

  } catch(error) {
    console.log(error);

    res.status(500).json({
      message:"Server Error"
    });
  }
};

module.exports = { getRevenueChart };