import Breadcrumbs from "@/components/ui/Breadcrumb";
import FullScreen from "@/components/ui/FullScreen";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRef, useState } from "react";
import { Avatar } from "../components/common/Avatar";
import { DropdownMenu } from "../components/common/Dropdown";
import TooltipButtonCustom from "../components/common/button/TooltipButton";

export default function AppNavbar({
  collapsed,
  onToggleSidebar,
  onChangePassword,
  onLogout,
}) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const isDark = theme === "dark";
  const { user } = useAuth();

  const menuItems = [
    {
      label: "Đổi mật khẩu",
      icon: "pi pi-key",
      command: onChangePassword,
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: onLogout,
    },
  ];

  const displayUserName = user?.employee?.fullName || user?.username || "Guest";

  const getAvatarUrl = () => {
    if (user?.employee?.avatar) {
      const avatarData = Array.isArray(user.employee.avatar)
        ? user.employee.avatar[0]
        : user.employee.avatar;
      return (
        avatarData?.url ||
        "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
      );
    }
    return "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png";
  };

  return (
    <header
      className={`
        sticky top-0 flex items-center px-3 py-2 sm:px-4 min-h-11 sm:min-h-12 md:min-h-14 z-40 transition-all duration-300 border-b
        ${
          isDark
            ? "bg-linear-to-r from-[#1f1f1f] to-[#2a2a2a] border-[#404040] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            : "bg-linear-to-r from-[#cfe8ff] to-[#e6f2ff] border-[#e0e6ed] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        }
      `}
    >
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-hidden">
          <TooltipButtonCustom
            icon={collapsed ? "pi pi-bars" : "pi pi-times"}
            onClick={onToggleSidebar}
            tooltip={collapsed ? "Mở menu" : "Đóng menu"}
            isDark={isDark}
            style={{ marginLeft: 5 }}
          />
          <div className="hidden sm:block">
            <Breadcrumbs theme={theme} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <FullScreen />
          {/* {showNotification && <Notification />} */}

          <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />

          <div className="relative" ref={avatarRef}>
            <div
              className="flex items-center gap-2.5 px-2 py-1 rounded-full cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span
                  className={`text-[13px] font-bold ${
                    isDark ? "text-white" : "text-[#262626]"
                  }`}
                >
                  {displayUserName}
                </span>
              </div>

              <Avatar image={getAvatarUrl()} />
            </div>

            <DropdownMenu
              items={menuItems}
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              anchorEl={avatarRef.current}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
