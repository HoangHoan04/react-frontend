import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error(
      "Phương thức useToast phải được sử dụng trong ToastProvider",
    );
  return ctx;
};

const ToastContainer = ({ toast, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const getTitle = () => {
    switch (toast.type) {
      case "success":
        return (
          <span className="text-green-600 text-lg font-bold">Thành công</span>
        );
      case "error":
        return <span className="text-red-600 text-lg font-bold">Lỗi</span>;
      case "warn":
        return (
          <span className="text-yellow-600 text-lg font-bold">Cảnh báo</span>
        );
      case "info":
        return (
          <span className="text-blue-600 text-lg font-bold">Thông tin</span>
        );
      default:
        return "";
    }
  };

  const getIcon = () => {
    const iconStyle = {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };

    switch (toast.type) {
      case "success":
        return (
          <div style={{ ...iconStyle, border: "2px solid #10B981 " }}>
            <i className="pi pi-check text-green-600 text-lg font-bold"></i>
          </div>
        );
      case "error":
        return (
          <div style={{ ...iconStyle, border: "2px solid #EF4444" }}>
            <i className="pi pi-times text-red-600 text-lg font-bold"></i>
          </div>
        );
      case "warn":
        return (
          <div style={{ ...iconStyle, border: "2px solid #F59E0B" }}>
            <i className="pi pi-exclamation-triangle text-yellow-600 text-lg font-bold"></i>
          </div>
        );
      case "info":
        return (
          <div style={{ ...iconStyle, border: "2px solid #3B82F6" }}>
            <i className="pi pi-info-circle text-blue-600 text-lg font-bold"></i>
          </div>
        );
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warn":
        return "#F59E0B";
      case "info":
        return "#3B82F6";
      default:
        return "#3B82F6";
    }
  };

  return (
    <div
      className={`toast-item ${isClosing ? "toast-exit" : "toast-enter"}`}
      style={{
        position: "relative",
        width: "380px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        marginBottom: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 16px 12px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flexShrink: 0, marginTop: "2px" }}>{getIcon()}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#1F2937",
                marginBottom: "4px",
              }}
            >
              {getTitle()}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.4",
              }}
            >
              {toast.message}
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              marginTop: "-2px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#4B5563")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <i className="pi pi-times text-gray-500 text-lg font-bold" />
          </button>
        </div>
      </div>

      <div
        style={{
          height: "4px",
          backgroundColor: "#E5E7EB",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="toast-progress"
          style={{
            height: "100%",
            backgroundColor: getProgressColor(),
            animation: `progress ${toast.timeout}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .toast-enter {
          animation: slideIn 0.3s ease-out;
        }

        .toast-exit {
          animation: slideOut 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ type = "info", title = "", message = "", timeout = 3000 }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message, timeout };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timeout);
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            {toasts.map((toast) => (
              <ToastContainer
                key={toast.id}
                toast={toast}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
