import PropTypes from "prop-types";

const CustomButton = ({
  label,
  icon,
  iconPos = "left",
  severity = "primary",
  outlined = false,
  text = false,
  raised = false,
  rounded = false,
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  ...rest
}) => {
  const severityStyles = {
    primary: {
      base: "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white border-primary-500",
      outlined:
        "border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100",
      text: "text-primary-500 hover:bg-primary-50 active:bg-primary-100",
    },
    secondary: {
      base: "bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border-gray-600",
      outlined:
        "border-gray-500 text-gray-600 hover:bg-gray-100 active:bg-gray-200",
      text: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    },
    success: {
      base: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white border-green-500",
      outlined:
        "border-green-500 text-green-500 hover:bg-green-50 active:bg-green-100",
      text: "text-green-500 hover:bg-green-50 active:bg-green-100",
    },
    info: {
      base: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white border-blue-500",
      outlined:
        "border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100",
      text: "text-blue-500 hover:bg-blue-50 active:bg-blue-100",
    },
    warning: {
      base: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white border-orange-500",
      outlined:
        "border-orange-500 text-orange-500 hover:bg-orange-50 active:bg-orange-100",
      text: "text-orange-500 hover:bg-orange-50 active:bg-orange-100",
    },
    danger: {
      base: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-red-500",
      outlined: "border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100",
      text: "text-red-500 hover:bg-red-50 active:bg-red-100",
    },
    help: {
      base: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white border-purple-500",
      outlined:
        "border-purple-500 text-purple-500 hover:bg-purple-50 active:bg-purple-100",
      text: "text-purple-500 hover:bg-purple-50 active:bg-purple-100",
    },
    contrast: {
      base: "bg-gray-900 hover:bg-gray-800 active:bg-black text-white border-gray-900 dark:bg-gray-100 dark:hover:bg-gray-200 dark:active:bg-white dark:text-gray-900",
      outlined:
        "border-gray-900 text-gray-900 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
      text: "text-gray-900 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800",
    },
  };

  const style = severityStyles[severity] || severityStyles.primary;

  // Chọn class chính theo mode (outlined / text / normal)
  let bgClass = style.base;
  if (outlined) bgClass = style.outlined;
  if (text) bgClass = style.text;

  // Các class chung
  const baseClasses = [
    // Căn giữa nội dung
    "inline-flex items-center justify-center gap-2",
    // Kích thước & padding giống PrimeReact button
    "px-4 py-2.5 text-base font-medium leading-tight",
    // Bo góc mặc định
    "rounded-md",
    // Transition mượt
    "transition-all duration-200 ease-in-out",
    // Focus ring giống PrimeReact
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400/50",
    // Disabled state
    disabled && "opacity-60 cursor-not-allowed",
    // Raised (box-shadow)
    raised && "shadow-md hover:shadow-lg active:shadow-sm",
    // Rounded pill
    rounded && "rounded-full px-6",
    // Loading: cursor-wait
    loading && "cursor-wait",
  ]
    .filter(Boolean)
    .join(" ");

  // Xử lý icon & loading
  const showIcon = icon && !loading;
  const iconClass = `pi ${icon} text-lg ${loading ? "animate-spin" : ""}`;

  // Loading icon mặc định (spinner)
  const loadingIcon = loading ? (
    <i className="pi pi-spin pi-spinner text-lg" />
  ) : null;

  return (
    <button
      type={type}
      className={`${baseClasses} ${bgClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {/* Icon bên trái hoặc loading */}
      {(showIcon && iconPos === "left") || loading ? (
        loading ? (
          loadingIcon
        ) : (
          <i className={iconClass} />
        )
      ) : null}

      {/* Label */}
      {label && <span>{label}</span>}

      {/* Icon bên phải */}
      {showIcon && iconPos === "right" && <i className={iconClass} />}
    </button>
  );
};

CustomButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  iconPos: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  severity: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "help",
    "contrast",
  ]),
  outlined: PropTypes.bool,
  text: PropTypes.bool,
  raised: PropTypes.bool,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default CustomButton;
