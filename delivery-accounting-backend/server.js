require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");
const createAdmin = require("./src/createAdmin");
require("./src/models");

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false })
  .then(async () => {
    console.log("Database Connected");

    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });