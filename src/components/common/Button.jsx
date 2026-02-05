import PropTypes from "prop-types";

const typeStyles = {
  primary: {
    base: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outlined: "border-blue-600 text-blue-600 hover:bg-blue-50",
    text: "text-blue-600 hover:bg-blue-50",
  },
  secondary: {
    base: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outlined: "border-gray-600 text-gray-600 hover:bg-gray-50",
    text: "text-gray-600 hover:bg-gray-50",
  },
  success: {
    base: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outlined: "border-green-600 text-green-600 hover:bg-green-50",
    text: "text-green-600 hover:bg-green-50",
  },
  info: {
    base: "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500",
    outlined: "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
    text: "text-cyan-600 hover:bg-cyan-50",
  },
  warning: {
    base: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
    outlined: "border-orange-500 text-orange-500 hover:bg-orange-50",
    text: "text-orange-500 hover:bg-orange-50",
  },
  error: {
    base: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outlined: "border-red-600 text-red-600 hover:bg-red-50",
    text: "text-red-600 hover:bg-red-50",
  },
  help: {
    base: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
    outlined: "border-purple-600 text-purple-600 hover:bg-purple-50",
    text: "text-purple-600 hover:bg-purple-50",
  },
};

const ButtonCustom = ({
  label,
  icon,
  iconPos = "left", // 'left' | 'right'
  type = "primary", // primary, secondary, success, info, warning, error, help
  variant = "contained", // contained | outlined | text | link
  size = "normal", // small | normal | large
  rounded = false,
  raised = false,
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed";

  const sizeClasses =
    {
      small: "px-3 py-1.5 text-sm rounded-md",
      normal: "px-4 py-2 text-base rounded-lg",
      large: "px-6 py-3 text-lg rounded-xl",
    }[size] || "px-4 py-2 text-base rounded-lg";

  const shapeClasses = rounded ? "rounded-full" : "";

  const raisedClasses = raised ? "shadow-md hover:shadow-lg" : "";

  const typeConfig = typeStyles[type] || typeStyles.primary;

  let variantClasses = "";
  if (variant === "outlined") {
    variantClasses = `border-2 bg-transparent ${typeConfig.outlined}`;
  } else if (variant === "text" || variant === "link") {
    variantClasses = `bg-transparent ${typeConfig.text} ${variant === "link" ? "underline hover:underline-offset-4" : ""}`;
  } else {
    variantClasses = typeConfig.base;
  }

  const loadingSpinner = loading && (
    <i className="pi pi-spin pi-spinner text-base" />
  );

  const iconElement = icon && !loading && (
    <i className={`pi ${icon} text-base ${loading ? "hidden" : ""}`} />
  );

  const content = (
    <>
      {(iconPos === "left" || !iconPos) &&
        (loading ? loadingSpinner : iconElement)}
      {label && <span>{label}</span>}
      {children}
      {iconPos === "right" && (loading ? loadingSpinner : iconElement)}
    </>
  );

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses} ${shapeClasses} ${raisedClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

ButtonCustom.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  iconPos: PropTypes.oneOf(["left", "right"]),
  type: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "error",
    "help",
  ]),
  variant: PropTypes.oneOf(["contained", "outlined", "text", "link"]),
  size: PropTypes.oneOf(["small", "normal", "large"]),
  rounded: PropTypes.bool,
  raised: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ButtonCustom;
