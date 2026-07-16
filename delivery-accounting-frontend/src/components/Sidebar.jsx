import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import i18n from "i18next";

/* MUI ICONS */
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";
import TodayIcon from "@mui/icons-material/Today";
import "./Sidebar.css";

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation(); // ✅ لازم تضيفها

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language);

  /* sync language state */
  useEffect(() => {
    const handler = (lng) => setLang(lng);

    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  /* toggle language */
  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  /* logout */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* ✅ اخفاء السيبدار في صفحة التفاصيل */
  const hideSidebar = location.pathname.startsWith("/statements/");

  if (hideSidebar) return null;

  /* MENU ITEMS */
  const menuItems = [
    {
      title: t("dashboard"),
      icon: <DashboardIcon />,
      path: "/",
      roles: ["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"],
    },
        {
  title: t("restaurants"),
  icon: <RestaurantIcon />,
  path: "/restaurants",
  roles: ["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"],
},
    {
      title: t("importExcel"),
      icon: <CloudUploadIcon />,
      path: "/import-orders",
      roles: ["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"],
    },
    {
      title: t("statements"),
      icon: <AssessmentIcon />,
      path: "/statements",
      roles: ["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"],
    },
 {
  title: t("dailyReports"),
   icon: <TodayIcon />,
  path:"/daily-reports",
  roles: ["ADMIN"],
},
    {
      title: t("users"),
      icon: <GroupIcon />,
      path: "/users",
      roles: ["ADMIN"],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        {t("offeratdashboard")}
      </div>

      {/* MENU */}
      <nav>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-actions-card">

          {/* LANGUAGE */}
          <button className="action-btn lang-btn" onClick={toggleLang}>
            <span className="icon-box">
              <LanguageIcon />
            </span>

            <div className="action-text">
              <span className="action-title">Language</span>
              <small>
                {i18n.language === "en" ? "العربية" : "English"}
              </small>
            </div>
          </button>

          {/* LOGOUT */}
          <button className="action-btn logout-btn" onClick={logout}>
            <span className="icon-box">
              <LogoutIcon />
            </span>

            <div className="action-text">
              <span className="action-title">
                {t("logout")}
              </span>
              <small>End Session</small>
            </div>
          </button>

        </div>
      </div>

      {/* VERSION */}
      <div className="sidebar-version">
        Offerat ERP
        <span>v1.0.0</span>
      </div>

    </aside>
  );
}

export default Sidebar;