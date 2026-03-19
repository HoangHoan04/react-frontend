import PropTypes from "prop-types";
import { useRef, useState } from "react";

const CustomTooltipButton = ({
  icon,
  label,
  onClick,
  tooltip,
  tooltipPosition = "top",
  className = "",
  style = {},
  size = "default", // "small" | "default" | "large"
  variant = "default", // "default" | "text" | "outlined"
  outlined = false,
  severity = "primary", // primary | secondary | success | info | warning | danger | help
  disabled = false,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const hasLabel = !!label;

  // Kích thước button
  const sizeClasses = {
    small: hasLabel ? "h-8 px-3 text-sm gap-1.5" : "w-8 h-8 text-sm",
    default: hasLabel ? "h-10 px-4 text-base gap-2" : "w-10 h-10 text-base",
    large: hasLabel ? "h-12 px-5 text-lg gap-2.5" : "w-12 h-12 text-lg",
  };

  // Shape: rounded-full nếu chỉ icon, rounded-md nếu có label
  const shapeClass = hasLabel ? "rounded-md" : "rounded-full";

  // Màu theo severity và variant
  const severityStyles = {
    primary: {
      default:
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm",
      text: "bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-600",
      outlined: "border-2 border-blue-600 text-blue-600",
    },
    outlined: {
      default: "text-gray-500",
      text: "bg-transparent text-gray-500",
      outlined: "text-gray-500",
    },
    secondary: {
      default:
        "bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-sm",
      text: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600",
      outlined: "border-2 border-gray-600 text-gray-600",
    },
    success: {
      default:
        "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm",
      text: "bg-transparent hover:bg-green-50 active:bg-green-100 text-green-600",
      outlined: "border-2 border-green-600 text-green-600",
    },
    info: {
      default:
        "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm",
      text: "bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-500",
      outlined: "border-2 border-blue-500 text-blue-500",
    },
    warning: {
      default:
        "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm",
      text: "bg-transparent hover:bg-orange-50 active:bg-orange-100 text-orange-500",
      outlined: "border-2 border-orange-500 text-orange-500",
    },
    danger: {
      default:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm",
      text: "bg-transparent hover:bg-red-50 active:bg-red-100 text-red-600",
      outlined: "border-2 border-red-600 text-red-600",
    },
    help: {
      default:
        "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-sm",
      text: "bg-transparent hover:bg-purple-50 active:bg-purple-100 text-purple-600",
      outlined: "border-2 border-purple-600 text-purple-600",
    },
  };

  const resolvedVariant = outlined ? "outlined" : variant;
  const buttonStyles =
    severityStyles[severity]?.[resolvedVariant] ||
    severityStyles.primary.default;

  // Tooltip position classes
  const tooltipPositions = {
    top: {
      container: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow:
        "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900 border-l-4 border-r-4 border-t-4",
    },
    bottom: {
      container: "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow:
        "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-900 border-l-4 border-r-4 border-b-4",
    },
    right: {
      container: "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow:
        "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-900 border-t-4 border-b-4 border-r-4",
    },
    left: {
      container: "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow:
        "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-900 border-t-4 border-b-4 border-l-4",
    },
  };

  const tooltipPos = tooltipPositions[tooltipPosition] || tooltipPositions.top;

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          font-medium transition-all duration-200
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${shapeClass}
          ${buttonStyles}
          ${className}
        `}
        style={style}
        {...rest}
      >
        {icon && <i className={`${icon} ${hasLabel ? "" : "text-base"}`} />}
        {label && <span className="font-medium">{label}</span>}
      </button>

      {/* Tooltip */}
      {showTooltip && tooltip && !disabled && (
        <div
          className={`
            absolute z-9999
            px-3 py-2 
            text-xs font-medium text-white
            bg-gray-900 rounded-md shadow-xl
            whitespace-nowrap pointer-events-none
            animate-in fade-in zoom-in-95 duration-200
            ${tooltipPos.container}
          `}
        >
          {tooltip}
          {/* Arrow */}
          <div className={`absolute w-0 h-0 ${tooltipPos.arrow}`} />
        </div>
      )}
    </div>
  );
};

CustomTooltipButton.propTypes = {
  icon: PropTypes.string, // Tên icon PrimeReact (ví dụ: "pi pi-check")
  label: PropTypes.string, // Text hiển thị trên button
  onClick: PropTypes.func, // Hàm xử lý sự kiện click
  tooltip: PropTypes.string, // Text hiển thị trong tooltip
  tooltipPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]), // Vị trí của tooltip
  className: PropTypes.string, // Class CSS tùy chỉnh
  style: PropTypes.object, // Style tùy chỉnh
  size: PropTypes.oneOf(["small", "default", "large"]), // Kích thước của button
  variant: PropTypes.oneOf(["default", "text", "outlined"]), // Kiểu của button
  outlined: PropTypes.bool, // Dùng nhanh kiểu outlined
  severity: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "help",
  ]), // Mức độ (màu sắc) của button
  disabled: PropTypes.bool, // Trạng thái disabled
};

export default CustomTooltipButton;
