import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./MainLayout.css";
import { useLocation } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();

  // الصفحات اللي بدك تخفي فيها الـ Navbar
  const hideNavbar = location.pathname.startsWith("/statements/");

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        {!hideNavbar && <Navbar />}  {/* 👈 هون الحل */}

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;