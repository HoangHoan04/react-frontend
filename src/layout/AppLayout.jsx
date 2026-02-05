import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sidebarWidth = 280;
  const collapsedWidth = 80;

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleChangePassword = () => {
    console.log("Change password");
  };

  const handleLogout = () => {
    console.log("Logout");
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
          onChangePassword={handleChangePassword}
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
