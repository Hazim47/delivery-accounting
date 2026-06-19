const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "delivery_accounting",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",

    logging: false,

    pool: {
      max: 30,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },

    define: {
      timestamps: true,
    },
  }
);

module.exports = sequelize;