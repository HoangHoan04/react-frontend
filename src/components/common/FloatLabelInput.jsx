import PropTypes from "prop-types";
import { useId } from "react";

const FloatLabel = ({
  label,
  value = "",
  onChange,
  icon = null,
  type = "text",
  placeholder = "",
  className = "",
  inputClassName = "",
  ...props
}) => {
  const id = useId();
  const hasValue = value != null && value !== "";

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        className={` peer w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
        disabled:bg-gray-100 disabled:text-gray-500
          transition-all duration-200
          ${icon ? "pl-10" : "pl-4"}
          ${inputClassName}
        `}
        {...props}
      />

      {icon && (
        <i
          className={`
            pi ${icon} absolute left-3 top-1/2 -translate-y-1/2 
            text-gray-500 text-xl pointer-events-none
            peer-focus:text-blue-500 transition-colors duration-200
          `}
        />
      )}

      <label
        htmlFor={id}
        className={`
          absolute left-4 pointer-events-none text-gray-500 
          transition-all duration-200 ease-in-out origin-left
          ${icon ? "left-10" : "left-4"}
          peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:px-1 
          ${
            hasValue
              ? "-top-4.5 text-xs text-blue-500 px-1 "
              : "top-1/2 -translate-y-1/2 text-base"
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

FloatLabel.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  icon: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default FloatLabel;
