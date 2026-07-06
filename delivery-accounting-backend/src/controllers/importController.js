const XLSX = require("xlsx");
const fs = require("fs");

const sequelize = require("../config/database");

const ImportLog = require("../models/ImportLog");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Driver = require("../models/Driver");

const importOrdersExcel = async (req, res) => {
  const transaction =
    await sequelize.transaction();

  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "Excel file is required",
      });
    }

    const workbook =
      XLSX.readFile(req.file.path);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];
const toNumber = (val) => {
  if (val === "" || val === null || val === undefined) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};
    const rows =
      XLSX.utils.sheet_to_json(sheet);
console.log("========== EXCEL COLUMNS ==========");
console.log(Object.keys(rows[0] || {}));
console.log("===================================");
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

    for (const row of rows) {
      console.log(row["التاريخ"], typeof row["التاريخ"]); 
      let orderDate = null;


if (row["التاريخ"]) {
  const parts = String(row["التاريخ"])
    .trim()
    .split("/");

  if (parts.length === 3) {
    orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
  }
}
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

      if (restaurantName) {
        restaurant =
          restaurantMap.get(
            restaurantName
          );

        if (!restaurant) {
          restaurant =
            await Restaurant.create(
              {
                name:
                  restaurantName,

                active: true,
              },
              { transaction }
            );

          restaurantMap.set(
            restaurantName,
            restaurant
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
startTime:
  row["وقت البدايه"] || "",

endTime:
  row["وقت النهايه"] || "",

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
  Number(
    row["العموله"]
  ) || 0,

commissionDescription:
  row["وصف العموله"] || "",
        orderAmount:
          Number(
            row[
              "قيمة الطلب"
            ]
          ) || 0,

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
          row[
            "رقم الفاتورة"
          ] || "",

        employeeNote: "",

        accountantNote: "",

        RestaurantId:
          restaurant?.id ||
          null,

        DriverId:
          driver?.id ||
          null,
      });

      imported++;
    }

    if (
      ordersToInsert.length
    ) {
      await Order.bulkCreate(ordersToInsert, {
  transaction,
  validate: false,
});
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
  } catch (error) {
    console.log("IMPORT ERROR:", error.message);

    console.log(error);

    return res.status(500).json({
      message:
        "Import failed",
      error:
        error.message,
    });
  } finally {
    if (
      req.file?.path &&
      fs.existsSync(
        req.file.path
      )
    ) {
      fs.unlinkSync(
        req.file.path
      );
    }
  }
};

module.exports = {
  importOrdersExcel,
};