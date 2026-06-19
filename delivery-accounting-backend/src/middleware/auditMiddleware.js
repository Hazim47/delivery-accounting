const AuditLog = require("../models/AuditLog");

const audit = (action) => {
  return async (req, res, next) => {
    await AuditLog.create({
      action,
      userId: req.user?.id,
      description: `${action} executed`,
    });

    next();
  };
};

module.exports = audit;