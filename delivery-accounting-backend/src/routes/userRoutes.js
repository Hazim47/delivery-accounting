const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createUser,
  getUsers,
  deleteUser,
  resetUserPassword,
  updatePermissions
} = require("../controllers/userController");

// Get all users
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers
);

// Create user
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createUser
);

// Delete user
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteUser
);
router.put(
  "/:id/reset-password",
  authMiddleware,
  roleMiddleware("ADMIN"),
  resetUserPassword
);
router.put(
  "/:id/permissions",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updatePermissions
);
module.exports = router;