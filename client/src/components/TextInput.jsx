import React from "react";

// Using forwardRef to maintain reference to the input element
const TextInput = React.forwardRef(
  ({ type = "text", placeholder, className = "", label, register, name, error }, ref) => {
    return (
      <div className="flex flex-col mt-4">
        {/* Display label only if provided */}
        {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
        
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
          className={`rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 transition-all duration-300 ease-in-out ${className}`}
          {...register}
          aria-invalid={error ? "true" : "false"}
        />

        {/* Display error message */}
        {error && (
          <span className="text-xs text-red-500 mt-1">{error}</span>
        )}
      </div>
    );
  }
);

export default TextInput;