import { Children, cloneElement, isValidElement, useState } from "react";

export const Accordion = ({
  children,
  multiple = false,
  defaultActiveIndex = 0,
  className = "",
  ...props
}) => {
  const [activeIndexes, setActiveIndexes] = useState(
    multiple ? [] : [defaultActiveIndex],
  );

  const toggleTab = (index) => {
    setActiveIndexes((prev) => {
      if (multiple) {
        return prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index];
      }
      return prev.includes(index) ? [] : [index];
    });
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;

        const isActive = activeIndexes.includes(index);
        const header = child.props.header || `Panel ${index + 1}`;

        return cloneElement(child, {
          header,
          isActive,
          onToggle: () => toggleTab(index),
          index,
        });
      })}
    </div>
  );
};

export const AccordionTab = ({
  header,
  children,
  isActive = false,
  onToggle,
  disabled = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  index,
}) => {
  return (
    <div className={`border-b border-gray-200 last:border-b-0 ${className}`}>
      <button
        type="button"
        className={`
          w-full flex items-center justify-between 
          px-5 py-4 text-left
          transition-colors duration-200
          focus:outline-none focus:ring-2  focus:z-10
          disabled:opacity-60 disabled:cursor-not-allowed
          ${headerClassName}
        `}
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        aria-expanded={isActive}
        aria-controls={`accordion-content-${index}`}
      >
        <span className="font-medium  text-[15px] leading-tight">{header}</span>
        <i
          className={`
            pi pi-chevron-down text-lg
            transition-transform duration-300 ease-in-out
            ${isActive ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${
            isActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className={`
              p-5 leading-relaxed
              ${isActive ? "border-t border-gray-200" : ""}
              ${contentClassName}
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
