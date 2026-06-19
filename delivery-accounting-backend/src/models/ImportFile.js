const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImportFile = sequelize.define(
  "ImportFile",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("processing", "completed", "failed"),
      defaultValue: "processing",
    },
  },
  {
    indexes: [
      { fields: ["uploadedBy"] },
      { fields: ["createdAt"] },
    ],
  }
);

module.exports = ImportFile;