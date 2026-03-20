import CustomButton from "@/components/common/button/Button";
import CustomInputPassword from "@/components/common/input/InputPassword";
import CustomInputText from "@/components/common/input/InputText";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useLogin } from "@/hooks/auth";
import { useAuthStore, useThemeStore } from "@/stores";
import { useEffect, useState } from "react";
import { ROUTES } from "../../common/constants/routes";
import { useRouter } from "../../route/hooks";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { loginUser, isLoading, error, setError } = useLogin();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.MAIN.HOME.path);
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      router.push(ROUTES.MAIN.HOME.path);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-blue-50 to-blue-100"
      }`}
    >
      {/* Theme Switch - Top Right Corner */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className={`rounded-lg shadow-lg p-8 ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <i
                  className={`pi pi-user text-2xl ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                ></i>
              </div>
            </div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Đăng nhập
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              Vui lòng nhập thông tin đăng nhập
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <CustomInputText
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              errorMessage={formErrors.email}
              icon="pi-envelope"
              iconPosition="left"
              disabled={isLoading}
              containerClassName="w-full"
              isDark={isDark}
            />

            {/* Password Input */}
            <CustomInputPassword
              label="Mật khẩu"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              errorMessage={formErrors.password}
              disabled={isLoading}
              containerClassName="w-full"
              isDark={isDark}
            />

            {/* General Error Message */}
            {error && (
              <div
                className={`rounded-md p-3 border ${
                  isDark
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <CustomButton
              label={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              severity="primary"
              className="w-full mt-6"
              raised
            />
          </form>

          {/* Footer */}
          <div
            className={`mt-6 text-center text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>
              Demo tài khoản:
              <span className="block mt-2 font-mono text-xs">
                Email: john@mail.com
              </span>
              <span className="block font-mono text-xs">
                Password: changeme
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div
          className={`mt-6 text-center text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p>Trang này yêu cầu đăng nhập để truy cập các tính năng khác</p>
        </div>
      </div>
    </div>
  );
}
