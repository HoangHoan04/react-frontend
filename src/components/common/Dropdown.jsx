import { useEffect, useRef } from "react";

export const DropdownMenu = ({
  items = [],
  isOpen,
  onClose,
  anchorEl,
  isDark = false,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (anchorEl && !anchorEl.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`
        absolute top-full right-0 mt-2
        min-w-50 rounded-lg border shadow-2xl
        py-2 z-50
        animate-in fade-in slide-in-from-top-2 duration-200
        ${
          isDark ? "bg-[#262626] border-[#404040]" : "bg-white border-[#e0e6ed]"
        }
      `}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.separator ? (
            <div
              className={`h-px my-1 ${
                isDark ? "bg-[#404040]" : "bg-[#e0e6ed]"
              }`}
            />
          ) : (
            <button
              onClick={() => {
                item.command?.();
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5
                text-[13px] font-medium text-left
                transition-all duration-200
                ${
                  isDark
                    ? "text-gray-300 hover:text-[#1890ff] hover:bg-white/5"
                    : "text-gray-700 hover:text-[#1890ff] hover:bg-black/5"
                }
              `}
            >
              {item.icon && <i className={`${item.icon} text-base`} />}
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
