import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { default as CustomButton } from "../common/button/Button";

const CustomConfirmDialog = ({
  visible = false,
  onHide,
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  header = "Xác nhận",
  acceptLabel = "Đồng ý",
  rejectLabel = "Hủy",
  icon = "pi pi-exclamation-triangle",
  acceptClassName = "",
  rejectClassName = "",
  severity = "warning",
  onAccept,
  onReject,
  isDark = false,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") onHide?.();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  const severityMap = {
    warning: "from-amber-500 to-orange-600 text-white",
    danger: "from-red-600 to-rose-700 text-white",
    info: "from-blue-600 to-indigo-600 text-white",
    success: "from-emerald-600 to-teal-600 text-white",
  };

  const headerBg =
    severityMap[severity] || "from-blue-600 to-indigo-600 text-white";

  const handleAccept = () => {
    onAccept?.();
    onHide?.();
  };

  const handleReject = () => {
    onReject?.();
    onHide?.();
  };

  const content = (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm p-4 transition-opacity duration-300 ${isDark ? "bg-black bg-opacity-500" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onHide?.();
      }}
    >
      <div
        ref={dialogRef}
        className={`
          w-full max-w-md sm:max-w-lg transform
          rounded-2xl shadow-2xl ring-1
          overflow-hidden transition-all duration-300 
          scale-100 opacity-500 animate-in fade-in zoom-in-95
        `}
      >
        {/* Header */}
        <div
          className={`
            flex items-center gap-4 px-6 py-5 bg-linear-to-r ${headerBg}
          `}
        >
          <i className={`${icon} text-3xl opacity-90`}></i>
          <h3 className="text-xl font-semibold tracking-tight">{header}</h3>
        </div>

        {/* Body */}
        <div className={`px-6 py-6 ${isDark ? "bg-gray-900" : "bg-white"}`}>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`flex flex-col sm:flex-row justify-end gap-3 px-6 py-5 border-t ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
        >
          <CustomButton
            label={rejectLabel}
            severity="danger"
            icon="pi pi-times-circle"
            iconPos="left"
            className={`justify-center ${rejectClassName}`}
            onClick={handleReject}
          />

          <CustomButton
            label={acceptLabel}
            severity={
              severity === "danger"
                ? "danger"
                : severity === "warning"
                  ? "warning"
                  : "primary"
            }
            icon="pi pi-check-circle"
            iconPos="left"
            className={`justify-center font-semibold ${acceptClassName}`}
            onClick={handleAccept}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default CustomConfirmDialog;
