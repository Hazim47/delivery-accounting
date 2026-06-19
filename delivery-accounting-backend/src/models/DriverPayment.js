const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DriverPayment = sequelize.define("DriverPayment", {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  note: {
    type: DataTypes.STRING,
  },
});

module.exports = DriverPayment;