const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define("Expense", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM("FUEL", "SALARY", "MAINTENANCE", "OTHER"),
    defaultValue: "OTHER",
  },
});

module.exports = Expense;