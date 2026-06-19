import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ImportOrders from "./pages/ImportOrders";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Restaurants from "./pages/Restaurants";
import DriverStatement from "./pages/DriverStatement";
import Statements from "./pages/Statements";
import StatementDetails from "./pages/StatementDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

  

        {/* Drivers */}
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Drivers />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Driver Statement */}
        <Route
          path="/drivers/:id/statement"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DriverStatement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Restaurants */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Restaurants />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/users"
  element={
    <ProtectedRoute
      roles={["ADMIN"]}
    >
      <MainLayout>
        <Users />
      </MainLayout>
    </ProtectedRoute>
  }
/>
       <Route
  path="/import-orders"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <MainLayout>
        <ImportOrders />
      </MainLayout>
    </ProtectedRoute>
  }

        />
        <Route
  path="/statements"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Statements />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/statements/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <StatementDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;