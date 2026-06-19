const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define("AuditLog", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: DataTypes.STRING,
  role: DataTypes.STRING,
  action: DataTypes.STRING,
  field: DataTypes.STRING,
  oldValue: DataTypes.TEXT,
  newValue: DataTypes.TEXT,
});

module.exports = AuditLog;