import { forwardRef } from "react";

const CustomInputText = forwardRef(
  (
    {
      label,
      placeholder = "",
      value = "",
      onChange,
      disabled = false,
      readonly = false,
      icon,
      iconPosition = "left",
      error = false,
      errorMessage = "",
      className = "",
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
      isDark = false,
      type = "text",
      size = "medium",
      ...rest
    },
    ref,
  ) => {
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
          {icon && iconPosition === "left" && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-base ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <i className={`pi ${icon}`} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            className={`
              ${baseInputClass}
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${className}
            `.trim()}
            {...rest}
          />

          {icon && iconPosition === "right" && (
            <div
              className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-base ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <i className={`pi ${icon}`} />
            </div>
          )}
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

CustomInputText.displayName = "CustomInputText";

export default CustomInputText;
