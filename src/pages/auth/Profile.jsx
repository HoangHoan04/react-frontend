import CustomButton from "@/components/common/button/Button";
import { useProfile } from "@/hooks/auth";
import { useAuthStore, useThemeStore } from "@/stores";
import { ROUTES } from "../../common/constants/routes";
import { useRouter } from "../../route/hooks";
import { useToastStore } from "../../stores";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { fetchProfile, isLoading: isLoadingProfile } = useProfile();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const showToast = useToastStore((state) => state.showToast);

  const handleRefreshProfile = async () => {
    await fetchProfile();
    showToast({
      message: "Làm mới người dùng thành công!",
      type: "success",
      title: "Thành công",
    });
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.AUTH.LOGIN.path, { replace: true });
  };

  const handleHome = () => {
    router.push(ROUTES.MAIN.HOME.path, { replace: true });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Đang tải thông tin người dùng...
          </p>
        </div>
      </div>
    );
  }

  // Separate info into categories
  const basicInfo = [
    { label: "Id", value: user?.id, icon: "pi-id-card" },
    { label: "Email", value: user?.email, icon: "pi-envelope" },
    { label: "Tên", value: user?.name, icon: "pi-user" },
    { label: "Vai trò", value: user?.role, icon: "pi-shield" },
  ];

  const loginInfo = Object.entries(user || {})
    .filter(([key]) => !["id", "email", "name", "role", "avatar"].includes(key))
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value:
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : JSON.stringify(value),
    }));

  return (
    <div className="space-y-8">
      {/* Header Section: Avatar - Name - Refresh Button */}
      <div className="flex items-center gap-8 px-12">
        {/* Avatar */}
        <div className="w-50 h-50 rounded-full overflow-hidden shadow-lg border-4 border-blue-500 shrink-0">
          <img
            src={
              user?.avatar ||
              "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
            }
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png";
            }}
          />
        </div>

        {/* Name and Info */}
        <div className="flex-1">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {user?.name || "Người dùng"}
          </h1>
          <p
            className={`text-lg mb-4 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {user?.email}
          </p>

          {/* Role Badge */}
          {user?.role && (
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  user.role === "admin"
                    ? isDark
                      ? "bg-red-900/40 text-red-300 border border-red-700"
                      : "bg-red-100 text-red-700 border border-red-300"
                    : isDark
                      ? "bg-blue-900/40 text-blue-300 border border-blue-700"
                      : "bg-blue-100 text-blue-700 border border-blue-300"
                }`}
              >
                {user.role === "admin" ? (
                  <i className="pi pi-crown text-yellow-500"></i>
                ) : (
                  <i className="pi pi-user text-blue-500"></i>
                )}
                <strong className="ml-2">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="shrink-0">
          <CustomButton
            label="Làm Mới"
            icon="pi-refresh"
            onClick={handleRefreshProfile}
            loading={isLoadingProfile}
            disabled={isLoadingProfile}
            severity="info"
            rounded
            iconPos="right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Basic Information */}
        <div className={`rounded-lg p-8 shadow-md`}>
          <h2
            className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <i className="pi pi-info-circle text-blue-500 text-xl"></i>
            Thông Tin Cơ Bản
          </h2>

          <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2">
            {basicInfo.map((item, index) => (
              <div key={index} className={`p-1 rounded-lg`}>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Information */}
        <div className={`rounded-lg p-8 shadow-md`}>
          <h2
            className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <i className="pi pi-lock text-green-500 text-xl"></i>
            Thông Tin Đăng Nhập
          </h2>

          {loginInfo.length > 0 ? (
            <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2">
              {loginInfo.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg `}>
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-sm font-medium break-all ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {item.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-6 rounded-lg text-center ${
                isDark ? "bg-gray-700/30" : "bg-gray-100"
              }`}
            >
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Không có thông tin bổ sung
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <CustomButton
          label="Quay Lại Trang Chủ"
          icon="pi-home"
          onClick={handleHome}
          severity="secondary"
          className="flex-1"
          iconPos="left"
        />
        <CustomButton
          label="Đăng Xuất"
          icon="pi-sign-out"
          onClick={handleLogout}
          severity="danger"
          className="flex-1"
          iconPos="left"
        />
      </div>
    </div>
  );
}
