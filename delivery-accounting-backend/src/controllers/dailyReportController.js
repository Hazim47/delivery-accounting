const DailyReport = require("../models/DailyReport");
const { Sequelize } = require("sequelize");

const getDailyReportsSummary = async(req,res)=>{
try{

const reports = await DailyReport.findAll({
attributes:[
"totalOrders",
"totalTariff",
"totalAccounting",
"drivers",
"restaurants"
],
raw:true
});


let totalOrders = 0;
let totalTariff = 0;
let totalAccounting = 0;

const drivers = new Set();
const restaurants = new Set();


reports.forEach(report=>{

totalOrders += Number(report.totalOrders || 0);

totalTariff += Number(report.totalTariff || 0);

totalAccounting += Number(report.totalAccounting || 0);


(report.drivers || []).forEach(d=>{
drivers.add(d);
});


(report.restaurants || []).forEach(r=>{
restaurants.add(r);
});


});


res.json({

totalOrders,

totalTariff,

totalAccounting,

totalDrivers: drivers.size,

totalRestaurants: restaurants.size

});


}catch(error){

console.log(error);

res.status(500).json({
message:"Server Error"
});

}

};

const getDailyReports = async (req, res) => {
  try {

    const reports = await DailyReport.findAll({
      order: [
        ["date", "DESC"]
      ]
    });

    res.json(reports);

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};
module.exports={
getDailyReportsSummary,
getDailyReports
};