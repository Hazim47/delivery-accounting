const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const User = require("./models/User");

async function createAdmin() {
  try {
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const existing = await User.findOne({
      where: { username: "admin" }
    });

    if (existing) {
      console.log("Admin already exists");
      return; // ✅ بس خروج من الدالة
    }

    await User.create({
      fullName: "Admin",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    });

    
  } catch (err) {
    console.error(err);
  }
}

module.exports = createAdmin;