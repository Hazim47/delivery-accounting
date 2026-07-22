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

const getDailyReports = async (req,res)=>{

try{

const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 50;

const search = req.query.search || "";


const offset = (page - 1) * limit;


const where = {};


if(search){

where.importDate = {
  [Op.like]: `%${search}%`
};

}


const {count,rows} = await DailyReport.findAndCountAll({

where,

limit,

offset,

order:[
 ["date","DESC"]
]

});


res.json({

data:rows,

pages:Math.ceil(count / limit),

total:count

});


}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

};
module.exports={
getDailyReportsSummary,
getDailyReports
};