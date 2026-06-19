const Order = require("../models/Order");
const Driver = require("../models/Driver");
const Restaurant = require("../models/Restaurant");
const { fn, col } = require("sequelize");

// Top Drivers
const getTopDrivers = async (req, res) => {
  try {
    const drivers = await Order.findAll({
      attributes: [
        "DriverId",
        [fn("SUM", col("driverEarning")), "total"],
      ],
      group: ["DriverId"],
      order: [[fn("SUM", col("driverEarning")), "DESC"]],
      limit: 5,
    });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Top Restaurants
const getTopRestaurants = async (req, res) => {
  try {
    const restaurants = await Order.findAll({
      attributes: [
        "RestaurantId",
        [fn("SUM", col("orderAmount")), "totalSales"],
      ],
      group: ["RestaurantId"],
      order: [[fn("SUM", col("orderAmount")), "DESC"]],
      limit: 5,
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getTopDrivers,
  getTopRestaurants,
};