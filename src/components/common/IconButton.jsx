import { useRef, useState } from "react";

export const IconButton = ({
  icon,
  onClick,
  tooltip,
  tooltipPosition = "top",
  className = "",
  style = {},
  isDark = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const getTooltipPositionClasses = () => {
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

  const tooltipClasses = getTooltipPositionClasses();

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9
          p-0 rounded-full transition-all duration-200 border-none
          flex items-center justify-center
          ${
            isDark
              ? "text-[#1890ff] hover:bg-[#1890ff]/20 active:bg-[#1890ff]/30"
              : "text-[#1890ff] hover:bg-[#1890ff]/10 active:bg-[#1890ff]/20"
          }
          focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20
          ${className}
        `}
        style={style}
      >
        <i className={`${icon} text-[14px] sm:text-[15px] md:text-[16px]`} />
      </button>

      {showTooltip && tooltip && (
        <div
          className={`
            absolute ${tooltipClasses.container}
            px-2 py-1 text-[11px] rounded whitespace-nowrap
            pointer-events-none z-50
            ${
              isDark
                ? "bg-[#262626] text-white border border-[#404040]"
                : "bg-[#262626] text-white"
            }
          `}
        >
          {tooltip}
          <div
            className={`
              absolute ${tooltipClasses.arrow}
              w-0 h-0 ${tooltipClasses.arrowColor}
            `}
          />
        </div>
      )}
    </div>
  );
};
