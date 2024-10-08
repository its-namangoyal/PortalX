import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Logout } from "../redux/userSlice";
import CustomButton from "./CustomButton";

function MenuList({ user, isProfileOpen, onClick }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as='div' className='inline-block text-left'>
        <div className='flex'>
          <Menu.Button
            className='inline-flex gap-2 items-center w-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 rounded-full shadow-md'
            onClick={onClick} // Pass the onClick to toggle the profile menu
          >
            <div className='flex flex-col items-start'>
              <p className='text-sm font-semibold'>{user?.firstName ?? user?.name}</p>
              <span className='text-sm text-blue-600'>{user?.projectTitle ?? user?.email}</span>
            </div>

            {user?.profileUrl ? (
              <img
                src={user?.profileUrl}
                alt='user profile'
                className='w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-indigo-600 text-white text-lg flex items-center justify-center'>
                {user?.firstName?.slice(0, 1) || user?.name?.slice(0, 1)}
              </div>
            )}

            {/* Rotate the chevron based on the isProfileOpen prop */}
            <BiChevronDown
              className={`h-8 w-8 text-slate-600 transform transition-transform duration-300 ${
                isProfileOpen ? 'rotate-180' : 'rotate-0'
              }`}
              aria-hidden='true'
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute z-50 right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none'>
            <div className='p-1'>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${user?.accountType ? "user-profile" : "company-profile"}`}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex items-center rounded-md p-2 text-sm`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${active ? "text-white" : "text-gray-600"} mr-2 h-5 w-5`}
                      aria-hidden='true'
                    />
                    {user?.accountType ? "Student Profile" : "Company / Professor Profile"}
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${active ? "text-white" : "text-gray-600"} mr-2 h-5 w-5`}
                      aria-hidden='true'
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage profile menu

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev); // Toggle profile open state
  };

  return (
    <>
      <div className='relative bg-[#f7fdfd] z-50 shadow-sm'>
        <nav className='container mx-auto flex items-center justify-between p-5'>
          <div>
            <Link
              to='/'
              className='text-blue-600 font-bold text-2xl hover:scale-110 transform transition-transform duration-300'
            >
              Portal<span className='text-[#1677cccb]'>X</span>
            </Link>
          </div>

          <ul className='hidden lg:flex gap-8 items-center text-base font-medium text-slate-700'>
            {user?.accountType === "seeker" && (
              <>
                <li>
                  <Link to='/'>Find Internships</Link>
                </li>
                <li>
                  <Link to='/companies'>Companies / Professors</Link>
                </li>
                <li>
                  <Link to='/my-projects'>My Projects</Link>
                </li>
              </>
            )}
            {user?.email && (
              <>
                <li>
                  <Link to={user?.accountType === "seeker" ? "/applications" : "/upload-project"}>
                    {user?.accountType === "seeker" ? "My Applications" : "Post a Project"}
                  </Link>
                </li>
                <li>
                  <Link to='/about-us'>About</Link>
                </li>
              </>
            )}
          </ul>

          <div className='hidden lg:block'>
            {!user?.token ? (
              <Link to='/user-auth'>
                <CustomButton
                  title='Sign In'
                  containerStyles='text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600'
                />
              </Link>
            ) : (
              <MenuList user={user} isProfileOpen={isProfileOpen} onClick={handleProfileClick} />
            )}
          </div>

          <button className='block lg:hidden text-slate-900' onClick={handleCloseNavbar}>
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className='lg:hidden flex flex-col items-start bg-[#f7fdfd] container mx-auto px-5 py-5'>
            <Link to='/' onClick={handleCloseNavbar} className='py-2'>
              Find Project
            </Link>
            <Link to='/companies' onClick={handleCloseNavbar} className='py-2'>
              Companies
            </Link>
            <Link
              onClick={handleCloseNavbar}
              to={user?.accountType === "seeker" ? "/applications" : "/upload-project"}
              className='py-2'
            >
              {user?.accountType === "seeker" ? "Applications" : "Upload Project"}
            </Link>
            <Link to='/about-us' onClick={handleCloseNavbar} className='py-2'>
              About
            </Link>

            <div className='w-full py-4'>
              {!user?.token ? (
                <Link to='/user-auth'>
                  <CustomButton
                    title='Sign In'
                    containerStyles='text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600'
                  />
                </Link>
              ) : (
                <MenuList user={user} onClick={handleCloseNavbar} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;