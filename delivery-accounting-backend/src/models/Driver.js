const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Driver = sequelize.define("Driver", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
  },

  vehicleType: {
    type: DataTypes.STRING,
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },

  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
});

module.exports = Driver;