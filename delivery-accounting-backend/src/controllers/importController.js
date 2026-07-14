const XLSX = require("xlsx");
const fs = require("fs");

const sequelize = require("../config/database");

const ImportLog = require("../models/ImportLog");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");


const parseExcelTime = (value) => {
  if (value === null || value === undefined || value === "") return "";

  // إذا كان نصاً
  if (typeof value === "string") {
    return value.trim();
  }

  // إذا كان رقم Excel
  if (typeof value === "number") {
    const t = XLSX.SSF.parse_date_code(value);

    if (!t) return "";

    const h = String(t.H).padStart(2, "0");
    const m = String(t.M).padStart(2, "0");
    const s = String(t.S).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  return "";
};

const importOrdersExcel = async (req,res)=>{

let transaction;

try{

if(!req.file){
 return res.status(400).json({
  message:"Excel file is required"
 });
}

transaction = await sequelize.transaction();

const workbook = XLSX.readFile(req.file.path, {
  cellDates: false,
  cellFormula: false,
  cellHTML: false,
  cellNF: false,
  cellStyles: false,
  dense: true,
});

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];
const toNumber = (val) => {
  if (val === "" || val === null || val === undefined) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};
    const rows = XLSX.utils.sheet_to_json(sheet, {
  raw: true,
  defval: "",
  blankrows: false,
}).filter(row =>
  Object.values(row).some(value => String(value).trim() !== "")
);

    const importLog =
      await ImportLog.create(
        {
          fileName:
            req.file.originalname,

          status: "processing",

          totalRows: rows.length,

          importedOrders: 0,

          skippedOrders: 0,

          restaurantsCreated: 0,

          driversCreated: 0,
        },
        { transaction }
      );

    let imported = 0;
    let skipped = 0;
    let restaurantsCreated = 0;
    let driversCreated = 0;

const [
  existingRestaurants,
  existingDrivers,
] = await Promise.all([
  Restaurant.findAll({
    raw: true,
    transaction,
  }),

  Driver.findAll({
    raw: true,
    transaction,
  }),
]);

    const restaurantMap =
      new Map();

    const driverMap =
      new Map();

   

    existingRestaurants.forEach(
      (r) => {
        restaurantMap.set(
          r.name,
          r
        );
      }
    );

    existingDrivers.forEach(
      (d) => {
        driverMap.set(
          d.fullName,
          d
        );
      }
    );

    const driverEarningsMap =
      new Map();

    const ordersToInsert = [];
const parseExcelDate = (value) => {
  if (!value) return null;

  const date = String(value).trim();

 


  // 4/7/2026
  if (date.includes("/")) {
    const parts = date.split("/");

    if (parts.length === 3) {
      return new Date(
        `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}T00:00:00`
      );
    }
  }


  // 2026 يوليو 4
  const arabicMonths = {
    "يناير": "01",
    "فبراير": "02",
    "مارس": "03",
    "أبريل": "04",
    "مايو": "05",
    "يونيو": "06",
    "يوليو": "07",
    "أغسطس": "08",
    "سبتمبر": "09",
    "أكتوبر": "10",
    "نوفمبر": "11",
    "ديسمبر": "12",
  };


  const parts = date.split(/\s+/);


  if (parts.length === 3) {

    const year = parts[0];
    const month = arabicMonths[parts[1]];
    const day = parts[2];


    if (year && month && day) {
      return new Date(
        `${year}-${month}-${day.padStart(2,"0")}T00:00:00`
      );
    }
  }


  // Excel serial date
  if (!isNaN(value)) {

    const excelDate =
      XLSX.SSF.parse_date_code(value);

    if (excelDate) {
      return new Date(
        excelDate.y,
        excelDate.m - 1,
        excelDate.d
      );
    }
  }

// صيغة 2026-07-04
if (date.includes("-")) {

  const parts = date.split("-");

  if (parts.length === 3) {
    return new Date(
      `${parts[0]}-${parts[1]}-${parts[2]}T00:00:00`
    );
  }
}
  return null;
};
const restaurantLastDateMap = new Map();
    for (const row of rows) {



  let orderDate =
    parseExcelDate(row["التاريخ"]);

      const orderNumber = String(
        row["رقم الطلب"] || ""
      ).trim();
if (!orderNumber) {
  skipped++;
  continue;
}
     
      let restaurant = null;

      const restaurantName =
        String(
          row["المطعم"] || ""
        ).trim();
if (restaurantName && orderDate) {

  const timestamp = new Date(orderDate).getTime();

  const old = restaurantLastDateMap.get(restaurantName);

  if (!old || timestamp > old.timestamp) {

    restaurantLastDateMap.set(
      restaurantName,
      {
        date: orderDate,
        timestamp
      }
    );

  }
}
      if (restaurantName) {
        restaurant =
          restaurantMap.get(
            restaurantName
          );

        if (!restaurant) {
          restaurant =
 await Restaurant.create(
 {
   name: restaurantName,
   active:true,
   lastOrderDate: orderDate,
 },
 {transaction}
);

         restaurantMap.set(
 restaurantName,
 restaurant.dataValues || restaurant
);

          restaurantsCreated++;
        }
      }

      let driver = null;

      const driverName =
        String(
          row["الكابتن"] || ""
        ).trim();

      if (driverName) {
        driver =
          driverMap.get(
            driverName
          );

        if (!driver) {
          driver =
            await Driver.create(
              {
                fullName:
                  driverName,

                phone:
                  row[
                    "رقم هاتف الكابتن"
                  ] || "",

                active: true,

                totalEarnings: 0,

                paidAmount: 0,
              },
              { transaction }
            );

          driverMap.set(
            driverName,
            driver
          );

          driversCreated++;
        }
      }

      const deliveryFee =
        Number(
          row["سعر التوصيل"]
        ) || 0;

      if (driver) {
        const current =
          driverEarningsMap.get(
            driver.id
          ) || 0;

        driverEarningsMap.set(
          driver.id,
          current +
            deliveryFee
        );
      }

      ordersToInsert.push({
        
        externalOrderId:
          orderNumber,

        ImportLogId:
          importLog.id,

        customerName:
          row["إسم الزبون"] ||
          row["اسم الزبون"] ||
          "Unknown",

        customerPhone:
          row["الهاتف"] ||
          row[
            "هاتف الزبون"
          ] ||
          "",

        customerAddress:
          row[
            "منطقة الزبون"
          ] || "",
startTime: parseExcelTime(row["وقت البدايه"]),

endTime: parseExcelTime(row["وقت النهايه"]),

branchName:
  row["الفرع"] || "",

captainPhone:
  row["رقم الهاتف"] || "",

tariff: toNumber(row["التعرفه"]),

customerAreaInput:
  row["منطقه الزبون - ادخال مطعم"] || "",

vehicleType:
  row["المركبة"] || "",

distance: toNumber(row["المسافة"]),

cancelReason:
  row["سبب الالغاء"] || "",

companyCommission:
  toNumber(row["العموله"]),

commissionDescription:
  row["وصف العموله"] || "",
AccountingDepartment:
  toNumber(
    row["قسم المحاسبة"] ??
    row["قسم المحاسبه"] ??
    row["تعويض المحاسبه"] ??
    row["تعويض المحاسبة"]
  ),
        orderAmount:
         toNumber(row["قيمة الطلب"]),

        deliveryFee,


        restaurantEarning: 0,

        driverEarning:
          deliveryFee,

        status: "DELIVERED",

        

        restaurantName:
          restaurantName,

        captainName:
          driverName,
orderDate,
        invoiceNumber:
  row["رقم الفاتورة"] || "",

employeeNote:
  row["ملاحظات"] ||
  row["ملاحظه موظف"] ||
  row["ملاحظة موظف"] ||
  "",

accountantNote:
  row["ملاحظات المحاسب"] || "",

RestaurantId:
  restaurant?.id || null,

DriverId:
  driver?.id || null,
      });

      imported++;
    }

if (ordersToInsert.length) {


  const chunkSize = 500;

  for (let i = 0; i < ordersToInsert.length; i += chunkSize) {
    const chunk = ordersToInsert.slice(i, i + chunkSize);

   await Order.bulkCreate(chunk, {
  transaction,
  validate:false,
  hooks:false,
  individualHooks:false,
  returning:false,
});
  }

}
const restaurantUpdates = [];

for (const [restaurantName, lastDate] of restaurantLastDateMap) {

  const restaurant = restaurantMap.get(restaurantName);

  if (!restaurant) continue;


  // تحديث فقط إذا التاريخ الجديد أحدث
 if(
 lastDate.date &&
 (
  !restaurant.lastOrderDate ||
  new Date(lastDate.date) > new Date(restaurant.lastOrderDate)
 )
){

    restaurantUpdates.push(
      Restaurant.update(
        {
          lastOrderDate: lastDate.date,
        },
        {
          where:{
            id: restaurant.id,
          },
          transaction,
        }
      )
    );

  }

}


for(let i = 0; i < restaurantUpdates.length; i += 500){

  await Promise.all(
    restaurantUpdates.slice(i, i + 500)
  );

}
    for (const [
      driverId,
      amount,
    ] of driverEarningsMap) {
      await Driver.increment(
        {
          totalEarnings:
            amount,
        },
        {
          where: {
            id: driverId,
          },
          transaction,
        }
      );
    }

    await importLog.update(
      {
        status: "completed",

        importedOrders:
          imported,

        skippedOrders:
          skipped,

        restaurantsCreated,

        driversCreated,
      },
      { transaction }
    );

    await transaction.commit();

    return res.json({
      success: true,
      imported,
      skipped,
      totalRows:
        rows.length,
      restaurantsCreated,
      driversCreated,
    });
  } catch(error){

 if(transaction){
   await transaction.rollback();
 }

 console.error(error);

 return res.status(500).json({
   message:"Import failed",
   error:error.message
 });
}finally {
    if (
      req.file?.path &&
      fs.existsSync(
        req.file.path
      )
    ) {
      await fs.promises.unlink(req.file.path);
    }
  }
};

module.exports = {
  importOrdersExcel,
};