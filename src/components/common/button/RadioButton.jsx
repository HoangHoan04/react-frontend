import PropTypes from "prop-types";

const CustomRadioButton = ({
  id,
  name,
  value,
  checkedValue,
  onChange,
  label,
  disabled = false,
  invalid = false,
  className = "",
  labelClassName = "",
  ...rest
}) => {
  const isChecked = checkedValue === value;

  const boxClasses = [
    "w-5 h-5",
    "rounded-full",
    "border-2",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    isChecked
      ? `bg-blue-600 border-transparent`
      : invalid
        ? `border-red-500 bg-white`
        : `border-gray-400 bg-white`,
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    `focus:ring-blue-400/50`,
    "hover:shadow-sm",
    isChecked &&
      'after:content-[""] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2',
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...rest}
      />

      <label
        htmlFor={id}
        className={`relative flex items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={boxClasses} aria-hidden="true" />
      </label>

      {label && (
        <label
          htmlFor={id}
          className={`text-base font-medium leading-none ${
            disabled ? "opacity-60" : "text-gray-700 dark:text-gray-300"
          } ${invalid ? "text-red-600 dark:text-red-400" : ""} ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

CustomRadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  checkedValue: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default CustomRadioButton;
