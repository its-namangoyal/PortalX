import React from "react";

const CustomButton = ({ title, containerStyles = "", iconRight = null, type = "button", onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center justify-center transition duration-300 ease-in-out ${containerStyles}`}
    >
      <span>{title}</span>
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default CustomButton;