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
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
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
          className={`text-sm font-medium leading-none mr-2 ${
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
  id: PropTypes.string.isRequired, // ID duy nhất cho radio button
  name: PropTypes.string.isRequired, // Tên nhóm radio button
  value: PropTypes.any.isRequired, // Giá trị của radio button
  checkedValue: PropTypes.any, // Giá trị đang được chọn trong nhóm
  onChange: PropTypes.func.isRequired, // Hàm xử lý sự kiện khi radio button thay đổi
  label: PropTypes.string, // Text hiển thị bên cạnh radio button
  disabled: PropTypes.bool, // Trạng thái disabled
  invalid: PropTypes.bool, // Trạng thái invalid (lỗi)
  className: PropTypes.string, // Class CSS tùy chỉnh cho container
  labelClassName: PropTypes.string, // Class CSS tùy chỉnh cho label
};

export default CustomRadioButton;
