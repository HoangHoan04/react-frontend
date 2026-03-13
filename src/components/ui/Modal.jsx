import { useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { useThemeStore } from "@/stores";
const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
};

const Modal = ({
  visible = false,
  title = "",
  children,
  footer = null,
  onClose,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  size = "md",
  className = "",
  bodyClassName = "",
  showCloseButton = true,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  useEffect(() => {
    if (!visible) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (closeOnEsc && event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, closeOnEsc, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center ${isDark ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm p-4`}
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={`w-full ${sizeClasses[size] || sizeClasses.md} rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl ring-1 ${isDark ? 'ring-white/10' : 'ring-black/5'} overflow-hidden ${className}`}
      >
        <div className={`flex items-center justify-between border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-5 py-4`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {title}
          </h3>
          {showCloseButton && (
            <button
              type="button"
              aria-label="Close modal"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} transition-colors`}
              onClick={onClose}
            >
              <i className="pi pi-times text-sm" />
            </button>
          )}
        </div>

        <div className={`px-5 py-4 ${bodyClassName}`}>{children}</div>

        {footer && (
          <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} px-5 py-4`}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  onClose: PropTypes.func,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
};

export default Modal;
