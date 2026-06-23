import { useEffect, useState } from "react";
import API from "../api/axios";

import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import { useTranslation } from "react-i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import {
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import "./Dashboard.css";
const user = JSON.parse(
  localStorage.getItem("user")
);
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const { t } = useTranslation();
const [resetKey, setResetKey] = useState(0);
const fetchDashboard = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await API.get(
      `/dashboard/overview?reset=${resetKey}`
    );

    setStats(response.data);
  } catch (err) {
    console.log(err);
    setError("Failed to load dashboard");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  fetchDashboard();
}, [resetKey]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <h2>{error}</h2>

        <Button
          variant="contained"
          onClick={fetchDashboard}
        >
          Retry
        </Button>
      </Box>
    );
  }

return (
  <div className="dashboard">
    {/* HEADER */}
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">
          {t("welcome")}, {user?.fullName}
        </h1>

        <p
          style={{
            marginTop: 6,
            color: "#a1a1aa",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {user?.role === "ADMIN" && t("administrator")}
          {user?.role === "ACCOUNTANT_1" && t("accountant")}
          {user?.role === "ACCOUNTANT_2" && t("accountant")}
          {user?.role === "EMPLOYEE" && t("employee")}
        </p>
      </div>


    </div>

    {/* STATS GRID */}
    <div className="stats-grid">
      <StatCard
        title={t("orders")}
        value={stats?.totalOrders || 0}
        icon={<ShoppingCartIcon />}
      />
      <StatCard
        title={t("drivers")}
        value={stats?.totalDrivers || 0}
        icon={<PeopleIcon />}
      />

      <StatCard
        title={t("restaurants")}
        value={stats?.totalRestaurants || 0}
        icon={<RestaurantIcon />}
      />
    </div>

    {/* CHART */}
    <div className="chart-card">
      <h3>{t("revenueAnalytics")}</h3>
      <RevenueChart />
    </div>
  </div>
);
}

export default Dashboard;