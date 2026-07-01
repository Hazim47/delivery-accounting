const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
permissions: {
  type: DataTypes.JSON,
  allowNull: false,
  defaultValue: {},
},
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM(
      "ADMIN",
      "ACCOUNTANT_1",
      "ACCOUNTANT_2",
      "EMPLOYEE"
    ),
    defaultValue: "EMPLOYEE",
  },
});

module.exports = User;