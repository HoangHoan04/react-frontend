import { useTheme } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Chọn...",
  className = "",
  disabled = false,
  position = "bottom",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(position);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Chuẩn hóa options về dạng {label, value}
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return opt;
    }
    return { label: String(opt), value: opt };
  });

  // Tìm option hiện tại
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Tự động xác định vị trí dropdown nếu position = "auto"
  useEffect(() => {
    if (isOpen && position === "auto" && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 200; // Ước tính chiều cao dropdown

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    } else if (position !== "auto") {
      setDropdownPosition(position);
    }
  }, [isOpen, position]);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          min-w-17.5 px-3 py-1.5
          text-sm font-medium border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i
          className={`pi pi-chevron-down text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute left-0 z-9999
            min-w-full w-max
            border rounded-md shadow-2xl
            py-1 ${isDark ? "bg-[#141414] text-white" : "bg-white text-gray-900"}
            ${
              dropdownPosition === "top"
                ? "bottom-full mb-1 animate-in fade-in slide-in-from-bottom-2"
                : "top-full mt-1 animate-in fade-in slide-in-from-top-2"
            }
            duration-200
          `}
          style={{ isolation: "isolate" }}
        >
          {normalizedOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-3 py-2 text-left text-sm
                transition-colors duration-150
                ${
                  option.value === value
                    ? isDark
                      ? "bg-blue-600 text-blue-100 font-medium"
                      : "bg-blue-50 text-blue-700 font-medium"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

CustomSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  position: PropTypes.oneOf(["top", "bottom", "auto"]),
};
