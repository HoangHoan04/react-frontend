import { useState } from "react";

export default function SelectOption({
  options = [],
  onChange,
  placeholder = "-- Chọn một tùy chọn --",
  isDark = false,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="w-64 mt-2">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full px-4 py-2 border rounded-xl shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {selected ? selected.label : placeholder}
        </button>

        {open && (
          <ul
            className={`absolute mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto z-20 ${
              isDark
                ? "bg-gray-700 border border-gray-600 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer ${
                  isDark ? "hover:bg-blue-600" : "hover:bg-blue-100"
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
