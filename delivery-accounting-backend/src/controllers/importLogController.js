const sequelize = require("../config/database");
const { Op } = require("sequelize");

const ImportLog = require("../models/ImportLog");
const Order = require("../models/Order");
const Driver = require("../models/Driver");
const Restaurant = require("../models/Restaurant");

/**
 * GET IMPORT LOGS
 */
const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE IMPORT LOG (OPTIMIZED VERSION)
 */
const getImportFileOrders = async (req,res)=>{

  try {

    const {id}=req.params;


    const orders = await Order.findAll({

      where:{
        ImportLogId:id
      },

      order:[
        ["id","ASC"]
      ]

    });


    res.json({
      data:orders
    });


  } catch(err){

    console.log(err);

    res.status(500).json({
      message:"Server Error"
    });

  }

};
const deleteImportLog = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {

    const logId = req.params.id;


    const log = await ImportLog.findByPk(logId,{
      transaction
    });


    if(!log){
      await transaction.rollback();

      return res.status(404).json({
        message:"Import not found"
      });
    }



    // جيب الطلبات لهذا الملف فقط
    const orders = await Order.findAll({
      where:{
        ImportLogId:logId
      },
      attributes:[
        "DriverId",
        "driverEarning"
      ],
      transaction
    });



    // نقص أرباح السائقين
    const driverMap={};


    orders.forEach(order=>{

      if(order.DriverId){

        driverMap[order.DriverId] =
        (driverMap[order.DriverId] || 0)
        +
        Number(order.driverEarning || 0);

      }

    });



    for(const driverId in driverMap){

      await Driver.decrement(
        {
          totalEarnings:driverMap[driverId]
        },
        {
          where:{
            id:driverId
          },
          transaction
        }
      );

    }



    // احذف الطلبات فقط
    await Order.destroy({

      where:{
        ImportLogId:logId
      },

      transaction

    });



    /*
      مهم:
      لا نحذف السائقين والمطاعم مباشرة
      نفحص هل مستخدمين في ملفات ثانية
    */



    await Driver.destroy({

      where:{
        id:{
          [Op.notIn]:sequelize.literal(`
            (
              SELECT DISTINCT "DriverId"
              FROM "Orders"
              WHERE "DriverId" IS NOT NULL
            )
          `)
        }
      },

      transaction

    });



    await Restaurant.destroy({

      where:{
        id:{
          [Op.notIn]:sequelize.literal(`
            (
              SELECT DISTINCT "RestaurantId"
              FROM "Orders"
              WHERE "RestaurantId" IS NOT NULL
            )
          `)
        }
      },

      transaction

    });



    // حذف ملف الاستيراد
    await ImportLog.destroy({

      where:{
        id:logId
      },

      transaction

    });



    await transaction.commit();


    res.json({

      success:true,

      message:"Deleted successfully"

    });



  }catch(error){

    await transaction.rollback();

    console.log(error);


    res.status(500).json({

      message:"Delete failed",

      error:error.message

    });

  }
};
module.exports = {
  getImportLogs,
  deleteImportLog,
   getImportFileOrders
};