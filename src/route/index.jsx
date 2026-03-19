import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import DashboardDemo from "@/pages/main/demo-page";
import { Route, Routes } from "react-router-dom";
import ProductManager from "../pages/main/product";
import ProductDetail from "../pages/main/product/ProductDetail";
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
            path={ROUTES.MAIN.PRODUCT_MANAGER.path}
            element={<ProductManager />}
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
          <Route path={ROUTES.MAIN.PRODUCT_MANAGER.children.DETAIL_PRODUCT.path} element={<ProductDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}
