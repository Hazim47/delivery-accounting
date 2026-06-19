const Restaurant = require("./Restaurant");
const Driver = require("./Driver");
const Order = require("./Order");
const ImportFile = require("./ImportFile");
const ImportedOrder = require("./ImportedOrder");
const DriverPayment = require("./DriverPayment");
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
Driver.hasMany(DriverPayment);
DriverPayment.belongsTo(Driver);
Branch.hasMany(Order);
Order.belongsTo(Branch);

module.exports = {
  Restaurant,
  Driver,
  Order,
  DriverPayment,
  ImportLog,
  Branch,
  AuditLog
};