import "./Navbar.css";
import i18n from "i18next";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
const { t } = useTranslation();
const roleNames = {
  ADMIN: t("administrator"),
  ACCOUNTANT_1: t("accountant"),
  ACCOUNTANT_2: t("accountant"),
  EMPLOYEE: t("employee"),
};


  return (
    <header className="navbar">

      {/* LEFT TITLE */}
      <div className="navbar-title">
        <h2>{t("offeratdashboard")}</h2>
        <span className="navbar-subtitle">
          {t("financialDashboard")}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">



        {/* USER CARD */}
        <div className="user-info">
          <div className="avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div>
            <div className="user-name">
              {user?.fullName || user?.username || "Admin"}
            </div>

            <div className="user-role">
              {roleNames[user?.role] || "Employee"}
            </div>
          </div>
        </div>

      

      </div>
    </header>
  );
}

export default Navbar;