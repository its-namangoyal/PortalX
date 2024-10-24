import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { popularSearch } from "../utils/data";
import { Homepage } from "../assets"; // Import the Homepage image

const SearchInput = ({ placeholder, value, setValue, handleClick }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div className="flex w-full md:w-2/3 items-center bg-white shadow-md p-3" style={{ borderRadius: "25px", background: "rgba(255, 255, 255, 0.8)" }}>
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

const Header = ({ title, type, handleClick, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      {/* Background Image Section */}
      <div
        className={`absolute inset-x-0 top-0 z-0 h-[350px] bg-cover bg-center`}
        style={{ backgroundImage: `url(${Homepage})` }}
      ></div>

      {/* Dark overlay only for the background image */}
      <div className="absolute inset-x-0 top-0 h-[350px] bg-black opacity-10 z-0"></div>

      <div className={`container mx-auto relative z-10 px-5 flex items-center h-[350px]`}>
        <div className="w-full">
          <div className="mb-8">
            <p className="text-white font-bold text-4xl">{title}</p> {/* Changed text color to white */}
          </div>

          <div className="w-full flex items-center justify-around bg-transparent px-5 py-4">
            <SearchInput
              placeholder="Search by internship title, keywords, or location"
              value={searchQuery}
              setValue={setSearchQuery}
              handleClick={handleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;