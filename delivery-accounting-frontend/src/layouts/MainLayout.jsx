import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

