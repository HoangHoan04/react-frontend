export const ThemeSwitch = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center
        w-14 h-7 sm:w-16 sm:h-8 rounded-full
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#1890ff]/30
        ${
          isDark
            ? "bg-[#1f1f1f] border border-[#404040]"
            : "bg-[#e6f2ff] border border-[#1890ff]/30"
        }
      `}
    >
      {/* Sliding circle */}
      <span
        className={`
          absolute inline-flex items-center justify-center
          w-5 h-5 sm:w-6 sm:h-6 rounded-full
          transition-all duration-300 shadow-md
          ${
            isDark
              ? "translate-x-1 bg-[#404040]"
              : "translate-x-8 sm:translate-x-9 bg-white"
          }
        `}
      >
        <i
          className={`
            text-[10px] sm:text-[11px] transition-all duration-300
            ${isDark ? "pi pi-moon text-[#60a5fa]" : "pi pi-sun text-[#fbbf24]"}
          `}
        />
      </span>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 sm:px-2">
        <i
          className={`pi pi-moon text-[9px] sm:text-[10px] transition-opacity duration-300 ${
            isDark ? "opacity-30" : "opacity-20"
          } text-[#60a5fa]`}
        />
        <i
          className={`pi pi-sun text-[9px] sm:text-[10px] transition-opacity duration-300 ${
            isDark ? "opacity-20" : "opacity-30"
          } text-[#fbbf24]`}
        />
      </div>
    </button>
  );
};
