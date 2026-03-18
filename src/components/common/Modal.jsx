import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function CustomModal({
  visible = false,
  onHide,
  header,
  children,
  footer,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  backdropClassName = "",
  modalWidth = "max-w-md",
  showHeader = true,
  showFooter = false,
  closeButton = true,
  isDark = false,
  onBackdropClick = true,
  ...rest
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    // Prevent body scroll when modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle ESC key press
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onHide?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  const handleBackdropClick = (event) => {
    if (onBackdropClick && event.target === event.currentTarget) {
      onHide?.();
    }
  };

  const content = (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ${
        isDark ? "bg-black/70" : "bg-black/50"
      } ${backdropClassName}`}
      onClick={handleBackdropClick}
      {...rest}
    >
      <div
        ref={modalRef}
        className={`
          w-full ${modalWidth} 
          rounded-2xl shadow-2xl 
          overflow-hidden
          transform transition-all duration-300
          scale-100 opacity-100 
          animate-in fade-in zoom-in-95
          ${isDark ? "bg-[#1f1f1f]" : "bg-white"}
          ${className}
        `.trim()}
      >
        {/* Header */}
        {showHeader && (
          <div
            className={`
              flex items-center justify-between gap-4
              px-6 py-4 border-b
              ${isDark ? "border-[#333] bg-[#262626]" : "border-gray-200 bg-gray-50"}
              ${headerClassName}
            `.trim()}
          >
            <h3 className="text-lg font-semibold leading-tight">{header}</h3>
            {closeButton && (
              <button
                type="button"
                onClick={onHide}
                className={`
                  h-8 w-8 inline-flex items-center justify-center
                  rounded-md transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30
                  ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400 hover:text-gray-200"
                      : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }
                `.trim()}
                aria-label="Dong modal"
              >
                <i className="pi pi-times text-lg" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={`
            px-6 py-4 max-h-[calc(100vh-300px)] overflow-y-auto
            ${isDark ? "bg-[#1f1f1f] text-gray-100" : "bg-white text-gray-900"}
            ${bodyClassName}
          `.trim()}
        >
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div
            className={`
              flex items-center justify-end gap-3
              px-6 py-4 border-t
              ${isDark ? "border-[#333] bg-[#262626]" : "border-gray-200 bg-gray-50"}
              ${footerClassName}
            `.trim()}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
