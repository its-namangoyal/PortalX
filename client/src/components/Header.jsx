import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { Homepage } from "../assets"; // Import the Homepage image

const SearchInput = ({ placeholder, value, setValue, handleClick }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div className="flex w-full md:w-2/3 items-center bg-white shadow-lg p-4 rounded-full">
      <input
        value={value}
        onChange={handleChange}
        type="text"
        className="flex-grow p-2 outline-none bg-transparent text-gray-800 placeholder-gray-500 text-base"
        placeholder={placeholder}
      />
      {value && (
        <AiOutlineCloseCircle
          className="text-gray-500 text-xl cursor-pointer mr-2"
          onClick={clearInput}
        />
      )}
      <button
        onClick={handleClick}
        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-md transition duration-300"
      >
        <FaSearch className="text-xl" />
      </button>
    </div>
  );
};

const Header = ({ title, type, handleClick, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      {/* Background Image Section */}
      <div
        className="absolute inset-x-0 top-0 h-[350px] bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Homepage})` }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-[350px] bg-gradient-to-b from-black/60 to-black/20 z-0"></div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-[350px] text-center px-5">
        {/* Title */}
        <h1 className="text-white font-extrabold text-4xl md:text-5xl mb-6 leading-tight">
          {title}
        </h1>

        {/* Search Input */}
        <div className="w-full max-w-3xl">
          <SearchInput
            placeholder="Search by internship title, keywords, or location"
            value={searchQuery}
            setValue={setSearchQuery}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;