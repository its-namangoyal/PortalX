import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ placeholder, value, setValue, handleClick }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div
      className="flex w-full md:w-1/2 items-center bg-white shadow-md px-3" // Adjusted width here
      style={{ borderRadius: "25px", background: "rgba(255, 255, 255, 0.8)" }}
    >
      <input
        value={value}
        onChange={handleChange}
        type="text"
        className="w-full p-2 outline-none bg-transparent text-base placeholder-gray-500"
        placeholder={placeholder}
      />
      {value && (
        <AiOutlineCloseCircle
          className="text-gray-600 text-xl cursor-pointer mr-2"
          onClick={clearInput}
        />
      )}
      <button onClick={handleClick} className="flex items-center justify-center">
        <FaSearch className="text-gray-600 text-2xl cursor-pointer" />
      </button>
    </div>
  );
};

const Header = ({ title, handleClick, searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full py-6 flex flex-col items-center bg-transparent">
      <p className="text-gray-800 font-bold text-2xl mb-5">{title}</p>
      <SearchInput
        placeholder="Search by internship title, keywords, or location"
        value={searchQuery}
        setValue={setSearchQuery}
        handleClick={handleClick}
      />
    </div>
  );
};

export default Header;
