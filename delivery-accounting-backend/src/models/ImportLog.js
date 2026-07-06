const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImportLog = sequelize.define(
"ImportLog",
{
fileName: {
type: DataTypes.STRING,
allowNull: false,
},

restaurantName: {
  type: DataTypes.STRING,
},

archiveYear: {
  type: DataTypes.INTEGER,
},

archiveMonth: {
  type: DataTypes.INTEGER,
},

isArchived: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},

uploadedAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
},
totalRows: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},

importedOrders: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},

skippedOrders: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},

restaurantsCreated: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
isLocked: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
driversCreated: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
uploadedBy: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

status: {
  type: DataTypes.ENUM(
    "processing",
    "completed",
    "failed"
  ),
  defaultValue: "completed",
},

}
);

module.exports = ImportLog;
