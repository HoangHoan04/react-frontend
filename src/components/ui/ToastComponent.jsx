export default function ToastComponent({ message, type, icon, duration }) {
  return (
    <div className={`toast toast-${type}`}>
      {icon && <span className="toast-icon">{icon}</span>}
      <div className="toast-message">{message}</div>
      {duration && <div className="toast-duration">Duration: {duration}ms</div>}
    </div>
  );
}
