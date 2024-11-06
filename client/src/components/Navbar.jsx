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

// MenuList Component: Handles the profile menu with options like profile navigation and logout
function MenuList({ user, isProfileOpen, onClick }) {
  const dispatch = useDispatch();

  // Logout function: Dispatches the logout action and redirects the user
  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className="flex">
          {/* Profile Button: Shows the user's profile picture and a dropdown icon */}
          <Menu.Button
            className="inline-flex gap-2 items-center w-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 rounded-full shadow-md"
            onClick={onClick} // Toggles the profile menu
          >
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold">{user?.firstName ?? user?.name}</p>
              <span className="text-sm text-blue-600">
                {user?.projectTitle ?? user?.email}
              </span>
            </div>

            {/* Profile Image: Displays user profile image or initials if no image */}
            {user?.profileUrl ? (
              <img
                src={user?.profileUrl}
                alt="user profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-lg flex items-center justify-center">
                {user?.firstName?.slice(0, 1) || user?.name?.slice(0, 1)}
              </div>
            )}

            {/* Chevron Icon: Rotates based on profile menu open state */}
            <BiChevronDown
              className={`h-8 w-8 text-slate-600 transform transition-transform duration-300 ${
                isProfileOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        {/* Profile Dropdown Menu: Contains the options like Profile and Logout */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-50 right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
            <div className="p-1">
              {/* Profile Option: Redirects user based on account type (Seeker/Company/Admin) */}
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${
                      user?.accountType === "seeker"
                        ? "user-profile"
                        : user?.accountType === "company"
                        ? "company-profile"
                        : "admin-profile"
                    }`}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex items-center rounded-md p-2 text-sm`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {user?.accountType === "seeker"
                      ? "Student Profile"
                      : user?.accountType === "company"
                      ? "Company Profile"
                      : "Admin Profile"}
                  </Link>
                )}
              </Menu.Item>

              {/* Logout Option: Triggers logout action */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5`}
                      aria-hidden="true"
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

// Main Navbar Component: Contains the navigation and user interaction for different account types
const Navbar = () => {
  const { user } = useSelector((state) => state.user); // Get user data from Redux store
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage profile menu

  // Toggles mobile navigation
  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggles profile dropdown menu
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <>
      <div className="relative bg-[#f7fdfd] z-50 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between p-5">
          {/* Logo Section */}
          <div>
            <Link
              to="/"
              className="text-blue-600 font-bold text-2xl hover:scale-110 transform transition-transform duration-300"
            >
              Portal<span className="text-[#1677cccb]">X</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-8 items-center text-base font-medium text-slate-700">
            {/* Show different menu options based on account type */}
            {user?.accountType === "seeker" && (
              <>
                <li>
                  <Link to="/">Find Internships</Link>
                </li>
                <li>
                  <Link to="/companies">Companies / Professors</Link>
                </li>
              </>
            )}

            {user?.accountType === "admin" && (
              <>
                <li>
                  <Link to='/student-list'>Students List</Link>
                </li>
                <li>
                  <Link to='/company-professor-list'>Professor / Company List</Link>
                </li>
                 <li> 
                 <Link to='/uploaded-list'>Uploaded List</Link>
                 </li>
                 <li> 
                 <Link to='/notes'>Notes</Link>
                 </li>
              </>
            )}

            {user?.email && (
              <>
                {user?.accountType === "seeker" && (
                  <li>
                    <Link to="/applications">My Applications</Link>
                  </li>
                )}

                {user?.accountType === "company" && (
                  <>
                    <li>
                      <Link to="/upload-project">Post a Project</Link>
                    </li>
                    <li>
                      <Link to="/student-applications">Applications</Link>
                    </li>
                  </>
                )}

                <li>
                  <Link to="/about-us">About</Link>
                </li>
              </>
            )}
          </ul>

          {/* Profile Section or Sign In button */}
          <div className="hidden lg:block">
            {!user?.token ? (
              <Link to="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles="text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600"
                />
              </Link>
            ) : (
              <MenuList user={user} isProfileOpen={isProfileOpen} onClick={handleProfileClick} />
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button className="block lg:hidden text-slate-900" onClick={handleCloseNavbar}>
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>

        {/* Mobile Menu: Conditional rendering based on isOpen state */}
        {isOpen && (
          <div className="lg:hidden flex flex-col items-start bg-[#f7fdfd] container mx-auto px-5 py-5">
            {user?.accountType === "seeker" && (
              <>
                <Link to="/" onClick={handleCloseNavbar} className="py-2">
                  Projects
                </Link>
                <Link to="/companies" onClick={handleCloseNavbar} className="py-2">
                  Companies
                </Link>
                <Link to="/applications" onClick={handleCloseNavbar} className="py-2">
                  Applications
                </Link>
              </>
            )}

            {user?.accountType === "admin" && (
              <>
                <Link to="/student-list" onClick={handleCloseNavbar} className="py-2">
                  Student List
                </Link>
                <Link to="/company-professor-list" onClick={handleCloseNavbar} className="py-2">
                  Professor / Company List
                </Link>
                <Link to='/uploaded-list' onClick={handleCloseNavbar} className='py-2'>
                Uploaded List
                </Link>
                <Link to='/notes' onClick={handleCloseNavbar} className='py-2'>
                Notes
                </Link>
              </>
            )}

            {user?.accountType === "company" && (
              <>
                <Link to='/upload-project' onClick={handleCloseNavbar} className='py-2'>
                  Upload Project
                </Link>
                <Link to='/applications' onClick={handleCloseNavbar} className='py-2'>
                  Applications
                </Link>
              </>
            )}

            {user?.email && (
              <Link to="/about-us" onClick={handleCloseNavbar} className="py-2">
                About
              </Link>
            )}

            {/* Sign In Button for Mobile */}
            <div className="w-full py-4">
              {!user?.token ? (
                <Link to="/user-auth">
                  <CustomButton
                    title="Sign In"
                    containerStyles="text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600"
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