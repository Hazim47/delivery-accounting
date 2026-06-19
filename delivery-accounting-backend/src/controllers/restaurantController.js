const Restaurant = require("../models/Restaurant");

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

// جلب كل المطاعم
const getRestaurants = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
const limit =
  Math.min(Number(req.query.limit) || 50, 100);

const offset = (page - 1) * limit;

const { rows, count } =
  await Restaurant.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

res.json({
  total: count,
  page,
  totalPages: Math.ceil(count / limit),
  restaurants: rows,
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
};