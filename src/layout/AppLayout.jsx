import { useAuthStore, useThemeStore } from "@/stores";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ROUTES } from "../common/constants/routes";
import { useRouter } from "../route/hooks";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const { logout } = useAuthStore();
  const router = useRouter();
  const isDark = theme === "dark";

  const sidebarWidth = 280;
  const collapsedWidth = 80;

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.AUTH.LOGIN.path);
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#141414]" : "bg-[#f5f5f5]"
      }`}
    >
      <AppSidebar
        collapsed={collapsed}
        sidebarWidth={sidebarWidth}
        collapsedWidth={collapsedWidth}
      />

      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: collapsed ? `${collapsedWidth}px` : `${sidebarWidth}px`,
        }}
      >
        <AppNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <main
          className={`flex-1 p-4 sm:p-6 overflow-auto transition-colors duration-300 ${
            isDark ? "bg-[#141414]" : "bg-[#f5f5f5]"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
