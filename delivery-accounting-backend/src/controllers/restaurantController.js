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

// ===========================

// الطلبات
let orders = [];
let stats = {};
let totalPages = 1;

try {

  const page = Number(req.query.page) || 1;
  const limit = 100;
  const offset = (page - 1) * limit;


  const [ordersResult, statsResult] = await Promise.all([

    Order.findAndCountAll({
      where,

      attributes: [
        "id",
        "orderDate",
        "customerName",
        "captainName",
        "customerAddress",
        "branchName",
        "orderAmount",
        "driverEarning",
        "restaurantEarning",
        "tariff",
        "AccountingDepartment",
        "status",
      ],

      order: [["orderDate", "DESC"]],

      limit,
      offset,

      raw:true,
    }),


    Order.findOne({
      where,

      attributes: [

        [
          sequelize.fn(
            "COUNT",
            sequelize.col("id")
          ),
          "totalOrders"
        ],

        [
          sequelize.fn(
            "SUM",
            sequelize.col("orderAmount")
          ),
          "totalSales"
        ],

        [
          sequelize.fn(
            "SUM",
            sequelize.col("tariff")
          ),
          "totalTariff"
        ],

        [
          sequelize.fn(
            "SUM",
            sequelize.col("AccountingDepartment")
          ),
          "totalAccountingDepartment"
        ],

        [
          sequelize.fn(
            "SUM",
            sequelize.col("driverEarning")
          ),
          "totalCaptainDiscount"
        ],

        [
          sequelize.fn(
            "SUM",
            sequelize.col("restaurantEarning")
          ),
          "restaurantNet"
        ],

      ],

      raw:true
    })

  ]);


  orders = ordersResult.rows;

  totalPages = Math.ceil(
    ordersResult.count / limit
  );

  stats = statsResult;

}catch (e) {

  
  console.log(e);
  throw e;

}

res.json({
  restaurant,

  stats: {
    totalOrders: Number(stats.totalOrders || 0),
    totalSales: Number(stats.totalSales || 0),
    totalCaptainDiscount: Number(stats.totalCaptainDiscount || 0),
    restaurantNet: Number(stats.restaurantNet || 0),
    totalTariff: Number(stats.totalTariff || 0),
    totalAccountingDepartment: Number(stats.totalAccountingDepartment || 0),
  },

  orders,

  totalPages
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
const getRestaurants = async (req,res)=>{
 try {

  const limit = 50;
  const page = Number(req.query.page) || 1;
  const offset = (page-1)*limit;

  const search = req.query.search || "";


  const where = {};

  if(search){
    where.name = {
      [Op.iLike]: `%${search}%`
    };
  }


  const {count, rows} = await Restaurant.findAndCountAll({

    where,

    attributes:[
      "id",
      "name",
      "phone",
      "address",
      "active",
      "commissionRate",
      "lastOrderDate",
    ],

    order:[
      ["lastOrderDate","DESC"]
    ],

    limit,
    offset,
    raw:true
  });


  res.json({

    restaurants: rows,

    pages: Math.ceil(count / limit),

    total: count

  });


 }catch(error){

 console.log(error);

 res.status(500).json({
  message:"Server Error"
 });

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