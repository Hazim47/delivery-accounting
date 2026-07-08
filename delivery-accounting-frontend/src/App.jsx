import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ImportOrders from "./pages/ImportOrders";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import Statements from "./pages/Statements";
import RestaurantDetails from "./pages/RestaurantDetails";
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
  path="/restaurants"
  element={
    <ProtectedRoute
      roles={["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"]}
    >
      <MainLayout>
        <Restaurants />
      </MainLayout>
    </ProtectedRoute>
  }
/>
       <Route
  path="/import-orders"
  element={
    <ProtectedRoute roles={["ADMIN", "ACCOUNTANT_1", "ACCOUNTANT_2", "EMPLOYEE"]}>
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
<Route
  path="/restaurants/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <RestaurantDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;