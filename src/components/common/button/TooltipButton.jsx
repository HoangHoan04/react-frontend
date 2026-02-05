// TooltipButtonCustom.jsx
import PropTypes from "prop-types";
import { useRef, useState } from "react";

const TooltipButtonCustom = ({
  icon,
  label,
  onClick,
  tooltip,
  tooltipPosition = "top",
  className = "",
  style = {},
  isDark = false,
  size = "default", // "small" | "default" | "large"
  variant = "default", // "default" | "text" | "outlined"
  severity = "primary", // MỚI: primary | secondary | success | info | warning | danger | help | contrast
  disabled = false,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  // Kích thước
  const sizeClasses =
    {
      small: "min-w-8 h-8 text-sm px-2.5",
      default: "min-w-9 h-9 text-base px-3",
      large: "min-w-11 h-11 text-lg px-4",
    }[size] || "min-w-9 h-9 text-base px-3";

  // Shape: rounded-full nếu chỉ icon, rounded-md nếu có label
  const hasLabel = !!label;
  const shapeClass = hasLabel ? "rounded-md" : "rounded-full";

  // Màu theo severity (gần giống PrimeReact Aura theme)
  const severityColors = {
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      hover: "#4f46e5",
      ring: "#c7d2fe",
    },
    secondary: {
      main: "#6b7280",
      light: "#9ca3af",
      hover: "#4b5563",
      ring: "#d1d5db",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      hover: "#059669",
      ring: "#a7f3d0",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      hover: "#2563eb",
      ring: "#bfdbfe",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      hover: "#d97706",
      ring: "#fde68a",
    },
    danger: {
      main: "#ef4444",
      light: "#f87171",
      hover: "#dc2626",
      ring: "#fecaca",
    },
    help: {
      main: "#8b5cf6",
      light: "#a78bfa",
      hover: "#7c3aed",
      ring: "#ddd6fe",
    },
    contrast: {
      main: isDark ? "#f3f4f6" : "#111827",
      light: isDark ? "#e5e7eb" : "#374151",
      hover: isDark ? "#d1d5db" : "#1f2937",
      ring: isDark ? "#9ca3af" : "#6b7280",
    },
  };

  const color = severityColors[severity] || severityColors.primary;

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
  `;

  // Variant styles (áp dụng màu từ severity)
  const variantStyles =
    {
      default: isDark
        ? `bg-[${color.main}] hover:bg-[${color.hover}] active:bg-[${color.hover}] text-white shadow-sm`
        : `bg-[${color.main}] hover:bg-[${color.hover}] active:bg-[${color.hover}] text-white shadow-sm`,
      text: isDark
        ? `bg-transparent hover:bg-[${color.light}]/20 active:bg-[${color.light}]/30 text-[${color.main}]`
        : `bg-transparent hover:bg-[${color.light}]/10 active:bg-[${color.light}]/20 text-[${color.main}]`,
      outlined: isDark
        ? `border border-[${color.light}] hover:bg-[${color.light}]/15 active:bg-[${color.light}]/25 text-[${color.main}]`
        : `border border-[${color.main}]/60 hover:bg-[${color.main}]/5 active:bg-[${color.main}]/10 text-[${color.main}]`,
    }[variant] || variantStyles.default;

  // Focus ring theo severity
  const focusRing = `focus:ring-[${color.ring}]/50`;

  // Tooltip position
  const getTooltipPosition = () => {
    const positions = {
      top: {
        container: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        arrow:
          "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent",
        arrowColor: isDark ? "border-t-[#262626]" : "border-t-[#262626]",
      },
      bottom: {
        container: "top-full left-1/2 -translate-x-1/2 mt-2",
        arrow:
          "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent",
        arrowColor: isDark ? "border-b-[#262626]" : "border-b-[#262626]",
      },
      right: {
        container: "left-full top-1/2 -translate-y-1/2 ml-2",
        arrow:
          "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent",
        arrowColor: isDark ? "border-r-[#262626]" : "border-r-[#262626]",
      },
      left: {
        container: "right-full top-1/2 -translate-y-1/2 mr-2",
        arrow:
          "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent",
        arrowColor: isDark ? "border-l-[#262626]" : "border-l-[#262626]",
      },
    };
    return positions[tooltipPosition] || positions.top;
  };

  const tooltipPos = getTooltipPosition();

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className={`
          ${baseStyles}
          ${sizeClasses}
          ${shapeClass}
          ${variantStyles}
          ${focusRing}
          ${className}
        `}
        style={style}
        {...rest}
      >
        {icon && (
          <i className={`${icon} text-lg ${hasLabel ? "" : "text-xl"}`} />
        )}
        {label && <span className="leading-none">{label}</span>}
      </button>

      {showTooltip && tooltip && !disabled && (
        <div
          className={`
            absolute z-50 px-3 py-1.5 text-xs rounded shadow-md whitespace-nowrap pointer-events-none
            ${
              isDark
                ? "bg-[#1f1f1f] text-white border"
                : "bg-gray-800 text-white shadow-xl"
            }
            ${tooltipPos.container}
          `}
        >
          {tooltip}
          <div
            className={`absolute w-0 h-0 ${tooltipPos.arrow} ${tooltipPos.arrowColor}`}
          />
        </div>
      )}
    </div>
  );
};

TooltipButtonCustom.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  className: PropTypes.string,
  style: PropTypes.object,
  isDark: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  variant: PropTypes.oneOf(["default", "text", "outlined"]),
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
  disabled: PropTypes.bool,
};

export default TooltipButtonCustom;
