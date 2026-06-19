const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    customerPhone: {
      type: DataTypes.STRING,
    },

    customerAddress: {
      type: DataTypes.STRING,
    },

    orderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    companyCommission: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    restaurantEarning: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    driverEarning: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    paymentMethod: {
      type: DataTypes.ENUM("CASH", "WALLET"),
      defaultValue: "CASH",
    },

    externalOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    ImportLogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    BranchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
employeeNote: {
  type: DataTypes.TEXT,
  defaultValue: "",
},

accountantNote: {
  type: DataTypes.TEXT,
  defaultValue: "",
},

orderDate: {
  type: DataTypes.DATEONLY,
},

restaurantName: {
  type: DataTypes.STRING,
},

captainName: {
  type: DataTypes.STRING,
},
startTime: {
  type: DataTypes.STRING,
},

endTime: {
  type: DataTypes.STRING,
},

branchName: {
  type: DataTypes.STRING,
},

captainPhone: {
  type: DataTypes.STRING,
},

tariff: {
  type: DataTypes.STRING,
},

customerAreaInput: {
  type: DataTypes.STRING,
},

vehicleType: {
  type: DataTypes.STRING,
},
employeeNoteBy: {
  type: DataTypes.STRING,
},

employeeNoteAt: {
  type: DataTypes.DATE,
},

accountantNoteBy: {
  type: DataTypes.STRING,
},

accountantNoteAt: {
  type: DataTypes.DATE,
},
distance: {
  type: DataTypes.STRING,
},

cancelReason: {
  type: DataTypes.TEXT,
},

commissionDescription: {
  type: DataTypes.TEXT,
},
invoiceNumber: {
  type: DataTypes.STRING,
},
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "PREPARING",
        "ON_THE_WAY",
        "DELIVERED",
        "CANCELLED"
      ),
      defaultValue: "PENDING",
    },
  },
  {
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["createdAt"],
      },
      {
        fields: ["DriverId"],
      },
      {
        fields: ["RestaurantId"],
      },
      {
        fields: ["ImportLogId"],
      },
      {
        unique: true,
        fields: ["externalOrderId"],
      },
    ],
  }
);

module.exports = Order;