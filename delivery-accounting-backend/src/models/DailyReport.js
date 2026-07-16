const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyReport = sequelize.define("DailyReport", {

  date:{
type:DataTypes.DATE,
allowNull:true
},
importDate:{
 type:DataTypes.DATE,
 allowNull:false
},
  totalOrders:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
totalRevenue:{
 type:DataTypes.FLOAT,
 defaultValue:0
},

totalProfit:{
 type:DataTypes.FLOAT,
 defaultValue:0
},
  totalTariff:{
    type:DataTypes.FLOAT,
    defaultValue:0
  },

  totalAccounting:{
    type:DataTypes.FLOAT,
    defaultValue:0
  },

  restaurants:{
    type:DataTypes.JSONB,
    defaultValue:[]
  },

  drivers:{
    type:DataTypes.JSONB,
    defaultValue:[]
  }

},{
 tableName:"DailyReports",
 timestamps:true
});


module.exports = DailyReport;