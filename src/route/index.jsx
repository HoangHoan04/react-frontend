import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import DashboardDemo from "@/pages/main/demo-page";
import { Route, Routes } from "react-router-dom";
import Product_manager from "@/pages/main/product";
import CategoryManager from "../pages/main/categories";
import CategoryDetail from "../pages/main/categories/detail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route bảo vệ */}
      <Route>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />
          <Route
            index
            path={ROUTES.MAIN.PRODUCT_MANAGER.path}
            element={<Product_manager />}
          />
          <Route
            path={ROUTES.MAIN.DEMODASHBOARD.path}
            element={<DashboardDemo />}
          />
          <Route
            path={ROUTES.MAIN.CATEGORY_MANAGER.path}
            element={<CategoryManager />}
          />
          <Route path="/category/detail/:id" element={<CategoryDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}
