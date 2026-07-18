const Restaurant = require("./Restaurant");
const Driver = require("./Driver");
const Order = require("./Order");
const ImportFile = require("./ImportFile");
const ImportedOrder = require("./ImportedOrder");
const Branch = require("./Branch");
const ImportLog = require("./ImportLog");
const AuditLog = require("./AuditLog");
// العلاقات
ImportFile.hasMany(ImportedOrder, {
  foreignKey: "fileId",
  onDelete: "CASCADE",
});
Order.hasMany(AuditLog, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});
Restaurant.hasMany(Order, {
  foreignKey: "RestaurantId"
});

Order.belongsTo(Restaurant, {
  foreignKey: "RestaurantId"
});
AuditLog.belongsTo(Order, {
  foreignKey: "orderId",
});
ImportedOrder.belongsTo(ImportFile, {
  foreignKey: "fileId",
});
Restaurant.hasMany(Order);
Order.belongsTo(Restaurant);
ImportLog.hasMany(Order);
Order.belongsTo(ImportLog);
Driver.hasMany(Order);
Order.belongsTo(Driver);
Branch.hasMany(Order);
Order.belongsTo(Branch);

module.exports = {
  Restaurant,
  Driver,
  Order,
  ImportLog,
  Branch,
  AuditLog
};