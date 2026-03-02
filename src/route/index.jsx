import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/main/dashboard";
import { Route, Routes } from "react-router-dom";
import Product_manager from "@/pages/main/product";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Route bảo vệ */}
      <Route>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />
          <Route index path={ROUTES.MAIN.PRODUCT_MANAGER.path} element={<Product_manager />} />
        </Route>
      </Route>
    </Routes>
  );
}
