const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "delivery_accounting",
  process.env.DB_USER || "delivery_accounting_user",
  process.env.DB_PASSWORD || "8jauTdLdgCMGteAuIssMM1pOHuSwBFFi",
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

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;