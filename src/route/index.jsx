import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import Login from "@/pages/auth/Login";
import Profile from "@/pages/auth/Profile";
import DashboardDemo from "@/pages/main/demo-page";
import { Route, Routes } from "react-router-dom";
import ProductManager from "../pages/main/product";
import CategoryManager from "../pages/main/categories";
import CategoryDetail from "../pages/main/categories/detail";
import DashboardPage from "../pages/main/dashboard";
import PrivateRoute from "./PrivateRoute";
import CustomersManager from "../pages/main/users/customers";
import EmployeesManager from "../pages/main/users/employee";
import ProductDetail from "../pages/main/product/Productdetail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route
            index
            path={ROUTES.MAIN.HOME.path}
            element={<DashboardPage />}
          />
          <Route path={ROUTES.AUTH.PROFILE.path} element={<Profile />} />
          <Route
            path={ROUTES.MAIN.PRODUCT_MANAGER.path}
            element={<ProductManager />}
          />
          <Route
            path={ROUTES.MAIN.PRODUCT_MANAGER.children.DETAIL_PRODUCT.path}
            element={<ProductDetail />}
          />
          <Route
            path={ROUTES.MAIN.DEMODASHBOARD.path}
            element={<DashboardDemo />}
          />
          <Route
            path={ROUTES.MAIN.CATEGORY_MANAGER.path}
            element={<CategoryManager />}
          />
          <Route
            path={ROUTES.MAIN.CATEGORY_MANAGER.children.DETAIL_CATEGORY.path}
            element={<CategoryDetail />}
          />

          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.path}
            element={<CustomersManager />}
          />

          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.path}
            element={<EmployeesManager />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
