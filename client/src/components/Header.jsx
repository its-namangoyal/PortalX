import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { HeroImage } from "../assets";
import { popularSearch } from "../utils/data";

const SearchInput = ({ placeholder, value, setValue, handleClick }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div className='flex w-full md:w-2/3 items-center bg-white shadow-md p-3' style={{ borderRadius: '25px', background: 'rgba(255, 255, 255, 0.8)' }}>
      <input
        value={value}
        onChange={handleChange}
        type='text'
        className='w-full p-2 outline-none bg-transparent text-base placeholder-gray-500'
        placeholder={placeholder}
      />
      {value && (
        <AiOutlineCloseCircle
          className='text-gray-600 text-xl cursor-pointer mr-2'
          onClick={clearInput}
        />
      )}
      <button onClick={handleClick} className='flex items-center justify-center'>
        <FaSearch className='text-gray-600 text-2xl cursor-pointer' />
      </button>
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className='bg-[#f7fdfd]'>
      <div
        className={`container mx-auto px-5 ${
          type ? "h-[500px]" : "h-[350px]"
        } flex items-center relative`}
      >
        <div className='w-full z-10'>
          <div className='mb-8'>
            <p className='text-slate-700 font-bold text-4xl'>{title}</p>
          </div>

          <div className='w-full flex items-center justify-around bg-transparent px-5 py-4'>
            <SearchInput
              placeholder='Search by internship title, keywords, or location'
              value={searchQuery}
              setValue={setSearchQuery}
              handleClick={handleClick}
            />
          </div>

          {/* {type && (
            <div className='w-full lg:w-1/2 flex flex-wrap gap-3 md:gap-6 py-10 md:py-14'>
              {popularSearch.map((search, index) => (
                <span
                  key={index}
                  className='bg-[#1d4fd826] text-[#1d4ed8] py-1 px-2 rounded-full text-sm md:text-base'
                >
                  {search}
                </span>
              ))}
            </div>
          )} */}
        </div>

      </div>
    </div>
  );
};

export default Header;