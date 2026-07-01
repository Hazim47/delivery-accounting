// ❌ لا تستخدم dotenv في production على Render
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./src/app");
const sequelize = require("./src/config/database");
const createAdmin = require("./src/createAdmin");
require("./src/models");

const PORT = process.env.PORT || 5000;

// 🔥 تأكد أولًا من الاتصال ثم sync
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database Connected");
    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    console.log("PORT =", process.env.PORT);

    return sequelize.sync();
  })
  .then(async () => {
    await createAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); // مهم حتى يفشل deploy بشكل واضح
  });