const AuditLog = require("../models/AuditLog");

const createAuditLog = async (data) => {
  console.log("AUDIT CALLED:", data);

  const log = await AuditLog.create({
    orderId: data.orderId,
    userId: data.user.id,
    userName: data.user.fullName,
    role: data.user.role,
    action: data.action,
    field: data.field,
    oldValue: data.oldValue,
    newValue: data.newValue,
  });

  console.log("AUDIT SAVED:", log.id);
};

module.exports = { createAuditLog };