const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

// كل الأدوار يقدروا يشوفوا
router.get("/", authMiddleware, getRestaurants);

// فقط ADMIN و ACCOUNTANT
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1"),
  createRestaurant
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "ACCOUNTANT_1"),
  updateRestaurant
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteRestaurant
);

module.exports = router;