import PropTypes from "prop-types";

const SearchInput = ({
  value = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Tìm kiếm...",
  className = "",
  inputClassName = "",
  disabled = false,
}) => {
  return (
    <div
      className={`relative flex w-full items-center rounded-lg border border-gray-300 bg-white shadow-xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 ${className}`}
    >
      <i className="pi pi-search pointer-events-none pl-3 text-sm text-gray-400" />

      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value, event)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSearch?.(value, event);
          }
        }}
        className={`h-10 w-full bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none ${inputClassName}`}
      />

      {value ? (
        <button
          type="button"
          className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Clear search"
          onClick={() => onClear?.()}
        >
          <i className="pi pi-times text-xs" />
        </button>
      ) : null}
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SearchInput;
