const Restaurant = require("../models/Restaurant");
const { Op } = require("sequelize");
const Order = require("../models/Order");
const sequelize = require("../config/database");
// إضافة مطعم
const createRestaurant = async (req, res) => {
  try {
    const { name, phone, address, commissionRate } = req.body;

    const restaurant = await Restaurant.create({
      name,
      phone,
      address,
      commissionRate,
    });

    res.status(201).json({
      message: "Restaurant created",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    
    // المطعم
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

const where = {
  RestaurantId: id,
};

if (from && to) {
  where.orderDate = {
    [Op.between]: [from, to],
  };
} else if (from) {
  where.orderDate = {
    [Op.gte]: from,
  };
} else if (to) {
  where.orderDate = {
    [Op.lte]: to,
  };
}
// ======== أضفهم هنا ========
console.log("FROM:", from);
console.log("TO:", to);
console.log("WHERE:", where);

const sample = await Order.findOne();
console.log("DATES IN DB SAMPLE:", sample);
// ===========================

// الطلبات
let orders = [];

try {
  orders = await Order.findAll({
    where,
    order: [["orderDate", "DESC"]],
  });

  console.log("ORDERS FOUND:", orders.length);
} catch (e) {
  console.log("FIND ALL ERROR:");
  console.log(e);
  throw e;
}

    // الإحصائيات
    const totalOrders = orders.length;

    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.orderAmount || 0),
      0
    );
const totalTariff = orders.reduce(
  (sum, order) => sum + Number(order.tariff || 0),
  0
);
const totalAccountingCompensation = orders.reduce(
  (sum, order) =>
    sum + Number(order.accountingCompensation || 0),
  0
);
    const totalCaptainDiscount = orders.reduce(
      (sum, order) => sum + Number(order.driverEarning || 0),
      0
    );

    const restaurantNet = orders.reduce(
      (sum, order) => sum + Number(order.restaurantEarning || 0),
      0
    );

    res.json({
      restaurant,
      stats: {
        totalOrders,
        totalSales,
        totalCaptainDiscount,
        restaurantNet,
        totalTariff,
        totalAccountingCompensation,
      },
      orders,
    });
 
  } catch (err) {
console.log(err);

console.log(err.name);
console.log(err.message);

console.log(err.parent);

console.log(err.original);

console.log(err.stack);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json({
      restaurant,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
// جلب كل المطاعم
const getRestaurants = async (req, res) => {
  try {
const restaurants = await Restaurant.findAll({
  attributes: {
    include: [
      [
        sequelize.literal(`(
          SELECT "orderDate"
          FROM "Orders"
          WHERE "Orders"."RestaurantId" = "Restaurant"."id"
          ORDER BY "orderDate" DESC
          LIMIT 1
        )`),
        "lastOrderDate",
      ],
    ],
  },
});

res.json({
  restaurants,
});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// تعديل مطعم
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }

    await restaurant.update(req.body);

    res.json({
      message: "Updated successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// حذف مطعم
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }

    await restaurant.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  getRestaurantById,
};