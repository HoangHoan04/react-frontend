import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import Login from "@/pages/auth/Login";
import Profile from "@/pages/auth/Profile";
import DashboardDemo from "@/pages/main/demo-page";
import { Route, Routes } from "react-router-dom";
import CategoryManager from "../pages/main/categories";
import CategoryDetail from "../pages/main/categories/detail";
import DashboardPage from "../pages/main/dashboard";
import PrivateRoute from "./PrivateRoute";

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
        </Route>
      </Route>
    </Routes>
  );
}
