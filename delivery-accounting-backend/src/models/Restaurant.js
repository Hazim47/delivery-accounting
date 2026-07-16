const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Restaurant = sequelize.define("Restaurant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
  },
captainName: {
 type: DataTypes.STRING
},
  address: {
    type: DataTypes.STRING,
  },
lastOrderDate: {
 type: DataTypes.DATE,
 allowNull:true
},
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10,
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Restaurant;