const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImportedOrder = sequelize.define(
  "ImportedOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    orderNumber: DataTypes.STRING,

    orderDate: DataTypes.DATEONLY,

    startTime: DataTypes.STRING,

    endTime: DataTypes.STRING,

    restaurant: DataTypes.STRING,

    branch: DataTypes.STRING,

    captain: DataTypes.STRING,

    phoneNumber: DataTypes.STRING,

    tariff: DataTypes.DECIMAL(10, 2),

    orderStatus: DataTypes.STRING,

    customerName: DataTypes.STRING,

    customerPhone: DataTypes.STRING,

    customerArea: DataTypes.STRING,

    customerAreaRestaurant: DataTypes.STRING,

    orderValue: DataTypes.DECIMAL(10, 2),

    deliveryPrice: DataTypes.DECIMAL(10, 2),

    totalValue: DataTypes.DECIMAL(10, 2),

    vehicle: DataTypes.STRING,

    distance: DataTypes.FLOAT,

    invoiceNumber: DataTypes.STRING,

    cancelReason: DataTypes.TEXT,

    commission: DataTypes.DECIMAL(10, 2),

    commissionDescription: DataTypes.TEXT,

    employeeNote: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    fileId: {
  type: DataTypes.BIGINT,
  allowNull: false,
},
    accountantNote: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    employeeNoteUpdatedAt: {
      type: DataTypes.DATE,
    },

    accountantNoteUpdatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      { fields: ["orderNumber"] },
      { fields: ["restaurant"] },
      { fields: ["customerName"] },
      { fields: ["customerPhone"] },
      { fields: ["captain"] },
      { fields: ["invoiceNumber"] },
      { fields: ["orderDate"] },
      { fields: ["orderStatus"] },
    ],
  }
);

module.exports = ImportedOrder;