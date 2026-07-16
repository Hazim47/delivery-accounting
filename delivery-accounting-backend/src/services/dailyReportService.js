const DailyReport=require("../models/DailyReport");
const { Op } = require("sequelize");

const generateDailyReports = async (
  transaction,
  dailyReportsMap,
  fileName
) => {


  let totalOrders = 0;
  let totalTariff = 0;
  let totalAccounting = 0;

  const drivers = new Set();
  const restaurants = new Set();


  // جمع كل تواريخ الملف بكرت واحد
  for (const [, report] of dailyReportsMap) {

    totalOrders += report.totalOrders;

    totalTariff += report.totalTariff;

    totalAccounting += report.totalAccounting;


    report.drivers.forEach(d=>{
      drivers.add(d);
    });


    report.restaurants.forEach(r=>{
      restaurants.add(r);
    });

  }


  const today = new Date();

  const start = new Date(today);
  start.setHours(0,0,0,0);


  const end = new Date(today);
  end.setHours(23,59,59,999);



  // هل يوجد كرت لهذا اليوم؟
  const exists = await DailyReport.findOne({

    where:{
      importDate:{
        [Op.between]:[
          start,
          end
        ]
      }
    },

    transaction

  });



  if(exists){

    await exists.update({

      totalOrders:
        exists.totalOrders + totalOrders,

      totalTariff:
        Number(exists.totalTariff) + totalTariff,

      totalAccounting:
        Number(exists.totalAccounting) + totalAccounting,


      drivers:[
        ...new Set([
          ...(exists.drivers || []),
          ...drivers
        ])
      ],


      restaurants:[
        ...new Set([
          ...(exists.restaurants || []),
          ...restaurants
        ])
      ],


      fileName:fileName || exists.fileName


    },{
      transaction
    });


  }else{


    await DailyReport.create({

      importDate:new Date(),

      date:new Date(),

      fileName:fileName || "Excel",

      totalOrders,

      totalTariff,

      totalAccounting,


      drivers:[
        ...drivers
      ],


      restaurants:[
        ...restaurants
      ]


    },{
      transaction
    });


  }


};


module.exports={
 generateDailyReports
};