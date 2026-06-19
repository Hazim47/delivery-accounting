const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

const getRestaurantStatement = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const totalOrders = await Order.count({
      where: { RestaurantId: restaurantId },
    });

    const totalEarnings = await Order.sum("restaurantEarning", {
      where: { RestaurantId: restaurantId, status: "DELIVERED" },
    });

    const totalCommission = await Order.sum("companyCommission", {
      where: { RestaurantId: restaurantId, status: "DELIVERED" },
    });

    res.json({
      restaurant,
      totalOrders,
      totalEarnings,
      totalCommission,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getRestaurantStatement };