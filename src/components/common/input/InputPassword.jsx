import { forwardRef, useState } from "react";

const CustomInputPassword = forwardRef(
  (
    {
      label,
      placeholder = "",
      value = "",
      onChange,
      disabled = false,
      readonly = false,
      error = false,
      errorMessage = "",
      className = "",
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
      isDark = false,
      size = "medium",
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Size mapping
    const sizeClasses = {
      small: "px-2 py-1 text-xs",
      medium: "px-3 py-2 text-sm",
      large: "px-4 py-3 text-base",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.medium;

    // Dark mode styles
    const inputBgClass = isDark
      ? "bg-[#111] border-[#333] text-gray-100 placeholder-gray-600"
      : "bg-white border-gray-300 text-gray-800 placeholder-gray-400";

    const inputFocusClass = isDark
      ? "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
      : "focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400";

    const errorClass = error
      ? isDark
        ? "border-red-500/60 text-red-400"
        : "border-red-400 text-red-600"
      : "";

    const disabledClass =
      disabled || readonly ? "opacity-60 cursor-not-allowed" : "";

    const baseInputClass = `
      w-full rounded-md border outline-none transition-all duration-200
      ${sizeClass}
      ${inputBgClass}
      ${inputFocusClass}
      ${errorClass}
      ${disabledClass}
      ${inputClassName}
    `.trim();

    return (
      <div className={containerClassName}>
        {label && (
          <label
            className={`block text-sm font-medium mb-1.5 ${
              isDark ? "text-gray-300" : "text-gray-700"
            } ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            className={`
              ${baseInputClass}
              pr-10
              ${className}
            `.trim()}
            {...rest}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled || readonly}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-base transition-colors ${
              disabled || readonly ? "cursor-not-allowed opacity-50" : ""
            } ${
              isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} />
          </button>
        </div>

        {error && errorMessage && (
          <p
            className={`mt-1 text-xs font-medium ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

CustomInputPassword.displayName = "CustomInputPassword";

export default CustomInputPassword;
