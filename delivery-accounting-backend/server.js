require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");
const createAdmin = require("./src/createAdmin");
require("./src/models");

const PORT = process.env.PORT || 5000;

sequelize.sync({alter:true})
  .then(async () => {
    console.log("Database Connected");
    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    console.log("PORT =", process.env.PORT);

    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });