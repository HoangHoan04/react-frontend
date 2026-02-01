import { useTheme } from "@/context/ThemeContext";
import { format, isValid, parse } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const CustomDateInput = ({
  label = "Chọn ngày",
  value = null,
  onChange,
  className = "",
  placeholder,
  type = "date", // "date", "time", "datetime",
  ...rest
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getFormat = () => {
    switch (type) {
      case "time":
        return "HH:mm";
      case "datetime":
        return "dd/MM/yyyy HH:mm";
      default:
        return "dd/MM/yyyy";
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    switch (type) {
      case "time":
        return "HH:mm";
      case "datetime":
        return "dd/MM/yyyy HH:mm";
      default:
        return "dd/MM/yyyy";
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState("");
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const wrapperRef = useRef(null);
  const inputId = `date-input-${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    if (isTyping) return;

    const dateFormat = getFormat();

    if (type === "time") {
      if (value && isValid(value)) {
        setInputValue(format(value, "HH:mm"));
        setSelectedHour(value.getHours());
        setSelectedMinute(value.getMinutes());
      } else {
        setInputValue("");
      }
    } else {
      if (value && isValid(value)) {
        setInputValue(format(value, dateFormat));
        setCurrentMonth(value);
        if (type === "datetime") {
          setSelectedHour(value.getHours());
          setSelectedMinute(value.getMinutes());
        }
      } else {
        setInputValue("");
      }
    }
    setError("");
  }, [value, type, getFormat, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format input khi người dùng gõ (tự động thêm dấu /)
  const formatAsUserTypes = (raw) => {
    const digits = raw.replace(/\D/g, "");
    let formatted = "";

    if (digits.length > 0) {
      const day = digits.slice(0, 2);
      formatted = day;

      if (digits.length > 2) {
        const month = digits.slice(2, 4);
        formatted = `${day}/${month}`;

        if (digits.length > 4) {
          const year = digits.slice(4, 8);
          formatted = `${day}/${month}/${year}`;

          if (type === "datetime" && digits.length > 8) {
            const hour = digits.slice(8, 10);
            formatted = `${day}/${month}/${year} ${hour}`;

            if (digits.length > 10) {
              const minute = digits.slice(10, 12);
              formatted = `${day}/${month}/${year} ${hour}:${minute}`;
            }
          }
        }
      }
    }

    return formatted;
  };

  // Kiểm tra ngày có hợp lệ thực tế không
  const validateDate = (formatted) => {
    const requiredLength = type === "datetime" ? 16 : 10;
    if (formatted.length !== requiredLength) return false;

    try {
      const dateFormat =
        type === "datetime" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
      const parsed = parse(formatted, dateFormat, new Date());
      if (!isValid(parsed)) return false;

      const parts = formatted.split(" ");
      const [d, m, y] = parts[0].split("/").map(Number);
      const checkDate = new Date(y, m - 1, d);

      const dateValid =
        checkDate.getFullYear() === y &&
        checkDate.getMonth() === m - 1 &&
        checkDate.getDate() === d;

      if (type === "datetime" && parts[1]) {
        const [h, min] = parts[1].split(":").map(Number);
        return dateValid && h >= 0 && h < 24 && min >= 0 && min < 60;
      }

      return dateValid;
    } catch {
      return false;
    }
  };

  // Xử lý khi người dùng gõ vào input
  const handleChange = (e) => {
    const raw = e.target.value;
    setIsTyping(true);

    if (type === "time") {
      const formatted = formatTimeInput(raw);
      setInputValue(formatted);

      if (formatted.length === 5) {
        const [h, m] = formatted.split(":").map(Number);
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
          const date = new Date();
          date.setHours(h, m, 0, 0);
          onChange(date);
          setSelectedHour(h);
          setSelectedMinute(m);
          setError("");
          setIsTyping(false);
        } else {
          setError("Giờ không hợp lệ");
        }
      }
    } else {
      const formatted = formatAsUserTypes(raw);
      setInputValue(formatted);

      if (formatted.length === (type === "datetime" ? 16 : 10)) {
        const isValidDate = validateDate(formatted);
        if (isValidDate) {
          const dateFormat =
            type === "datetime" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
          const parsed = parse(formatted, dateFormat, new Date());
          onChange(parsed);
          setCurrentMonth(parsed);
          if (type === "datetime") {
            setSelectedHour(parsed.getHours());
            setSelectedMinute(parsed.getMinutes());
          }
          setError("");
          setIsTyping(false);
        } else {
          setError("Ngày không hợp lệ");
        }
      } else {
        setError("");
      }
    }
  };

  const formatTimeInput = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  // Chọn ngày từ lịch
  const handleSelectDate = (date) => {
    if (!isValid(date)) return;
    setIsTyping(false);

    if (type === "datetime") {
      const newDate = new Date(date);
      newDate.setHours(selectedHour, selectedMinute, 0, 0);
      onChange(newDate);
      setInputValue(format(newDate, "dd/MM/yyyy HH:mm"));
      setCurrentMonth(newDate);
      setError("");
    } else {
      onChange(date);
      setInputValue(format(date, "dd/MM/yyyy"));
      setCurrentMonth(date);
      setError("");
      setShowCalendar(false);
    }
  };

  const handleTimeChange = (hour, minute) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);

    if (type === "time") {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      onChange(date);
      setInputValue(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    } else if (type === "datetime" && value && isValid(value)) {
      const newDate = new Date(value);
      newDate.setHours(hour, minute, 0, 0);
      onChange(newDate);
      setInputValue(format(newDate, "dd/MM/yyyy HH:mm"));
    }
  };

  // Chuyển tháng trước/sau
  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Render các ô ngày trong tháng
  const renderDays = (monthDate = currentMonth) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const cells = [];

    // Ô trống trước ngày 1
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        value && isValid(value) && value.toDateString() === date.toDateString();

      cells.push(
        <button
          key={day}
          type="button"
          onClick={() => handleSelectDate(date)}
          className={`
            w-10 h-10 rounded-full text-sm flex items-center justify-center transition-colors
            ${
              isSelected
                ? "bg-blue-600 text-white"
                : isToday
                  ? `border-2 border-blue-500 ${
                      isDark
                        ? "text-blue-400 hover:bg-gray-700"
                        : "text-blue-700 hover:bg-blue-50"
                    }`
                  : `${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-800 hover:bg-blue-50"}`
            }
          `}
        >
          {day}
        </button>,
      );
    }

    return cells;
  };

  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const hasValueOrFocus = inputValue.length > 0 || showCalendar;
  const hasError = !!error;

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* Input + Label + Icon */}
      <div className="relative">
        <label
          htmlFor={inputId}
          className={`
            absolute px-1 pointer-events-none transition-all duration-200 ease-in-out origin-left
            ${isDark ? "bg-gray-800" : "bg-white"}
            ${
              hasError
                ? "text-red-600 -top-5.5 text-xs"
                : hasValueOrFocus
                  ? "-top-5.5 text-xs text-blue-600"
                  : "top-1/2 left-4 -translate-y-1/2 text-base text-gray-500 peer-focus:-top-5.5 peer-focus:text-xs peer-focus:text-blue-600"
            }
          `}
        >
          {label}
        </label>

        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onClick={() => setShowCalendar(true)}
          placeholder={getPlaceholder()}
          autoComplete="off"
          className={`
            peer w-full px-4 py-3.5 pr-11 transition-all duration-200 rounded-lg
            focus:outline-none focus:ring-2
            ${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
            ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : `border ${isDark ? "border-gray-600" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500/30`
            }
          `}
          {...rest}
        />

        <button
          type="button"
          onClick={() => setShowCalendar((prev) => !prev)}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            isDark
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <i className="pi pi-calendar text-xl" />
        </button>
      </div>

      {/* Thông báo lỗi */}
      {hasError && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

      {/* Popup lịch */}
      {showCalendar && type !== "time" && (
        <div
          className={`absolute z-50 mt-2 rounded-xl shadow-xl p-5 border ${
            type === "datetime" ? "w-96" : "w-80"
          } ${
            isDark
              ? "bg-gray-800 text-gray-300 border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          }`}
        >
          {
            <>
              {/* Header tháng/năm */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-300 hover:text-blue-400"
                      : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <i className="pi pi-chevron-left" />
                </button>

                <span
                  className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  {currentMonth.toLocaleString("vi-VN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <button
                  type="button"
                  onClick={nextMonth}
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-300 hover:text-blue-400"
                      : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <i className="pi pi-chevron-right" />
                </button>
              </div>

              {/* Thứ trong tuần */}
              <div
                className={`grid grid-cols-7 gap-1 mb-3 text-xs font-medium text-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {weekdays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Lưới ngày */}
              <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
            </>
          }

          {/* Time picker for datetime */}
          {type === "datetime" && (
            <div
              className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center justify-center gap-2">
                <div>
                  <label className="block text-xs mb-1 text-center">Giờ</label>
                  <select
                    value={selectedHour}
                    onChange={(e) =>
                      handleTimeChange(Number(e.target.value), selectedMinute)
                    }
                    className={`px-2 py-1 rounded border text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="mt-5">:</span>
                <div>
                  <label className="block text-xs mb-1 text-center">Phút</label>
                  <select
                    value={selectedMinute}
                    onChange={(e) =>
                      handleTimeChange(selectedHour, Number(e.target.value))
                    }
                    className={`px-2 py-1 rounded border text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Time picker popup */}
      {showCalendar && type === "time" && (
        <div
          className={`absolute z-50 mt-2 w-64 rounded-xl shadow-xl p-5 border ${
            isDark
              ? "bg-gray-800 text-gray-300 border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          }`}
        >
          <div className="text-center mb-4 font-semibold">Chọn giờ</div>
          <div className="flex items-center justify-center gap-2">
            <div>
              <label className="block text-xs mb-1 text-center">Giờ</label>
              <select
                value={selectedHour}
                onChange={(e) =>
                  handleTimeChange(Number(e.target.value), selectedMinute)
                }
                className={`px-3 py-2 rounded border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300"
                }`}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <span className="mt-5 text-xl">:</span>
            <div>
              <label className="block text-xs mb-1 text-center">Phút</label>
              <select
                value={selectedMinute}
                onChange={(e) =>
                  handleTimeChange(selectedHour, Number(e.target.value))
                }
                className={`px-3 py-2 rounded border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300"
                }`}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
};

CustomDateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(["date", "time", "datetime"]),
};

export default CustomDateInput;
