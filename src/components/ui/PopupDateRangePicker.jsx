import { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function PopupDateRangePicker({ isDark }) {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full p-2 border rounded-lg text-left ${
          isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white"
        }`}
      >
        {range[0].startDate.toLocaleDateString("vi-VN")} -{" "}
        {range[0].endDate.toLocaleDateString("vi-VN")}
      </button>

      {open && (
        <div className="absolute top-12 left-0 z-50 shadow-xl rounded-xl bg-white p-4 border">
          <DateRangePicker
            ranges={range}
            onChange={(item) => setRange([item.selection])}
            showPreview={false}
            showSelectionPreview={false}
            rangeColors={["#3b82f6"]}
            direction="horizontal"
            maxDate={new Date()}
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
