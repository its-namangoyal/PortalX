import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Logout } from "../redux/userSlice";
import CustomButton from "./CustomButton";

// MenuList Component: Handles the profile menu with options like profile navigation and logout
function MenuList({ user, isProfileOpen, onClick }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex items-center gap-2 bg-white px-4 py-2 text-sm font-medium text-slate-700 rounded-full shadow-md hover:bg-opacity-20"
        onClick={onClick} // Toggles the profile menu
      >
        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold">{user?.firstName ?? user?.name}</p>
          <span className="text-sm text-blue-600">{user?.projectTitle ?? user?.email}</span>
        </div>

        {/* Profile Image or Initials */}
        {user?.profileUrl ? (
          <img src={user?.profileUrl} alt="user profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-lg flex items-center justify-center">
            {user?.firstName?.slice(0, 1) || user?.name?.slice(0, 1)}
          </div>
        )}

        <BiChevronDown className={`h-8 w-8 text-slate-600 transform transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
      </Menu.Button>

      {/* Dropdown Menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 mt-2 w-56 right-0 bg-white divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={`${
                    user?.accountType === "seeker"
                      ? "user-profile"
                      : user?.accountType === "company"
                      ? "professor-profile"
                      : "admin-profile"
                  }`}
                  className={`group flex items-center rounded-md p-2 text-sm ${active ? "bg-blue-500 text-white" : "text-gray-900"}`}
                  onClick={onClick}
                >
                  <CgProfile className={`mr-2 h-5 w-5 ${active ? "text-white" : "text-gray-600"}`} />
                  {user?.accountType === "seeker"
                    ? "Student Profile"
                    : user?.accountType === "company"
                    ? "Company Profile"
                    : "Admin Profile"}
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm ${active ? "bg-blue-500 text-white" : "text-gray-900"}`}
                >
                  <AiOutlineLogout className={`mr-2 h-5 w-5 ${active ? "text-white" : "text-gray-600"}`} />
                  Log Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// Main Navbar Component: Contains the navigation and user interaction for different account types
const Navbar = () => {
  const { user } = useSelector((state) => state.user); // Get user data from Redux store
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state
  const location = useLocation(); // Use location hook to get current path

  // Toggles mobile navigation
  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggles profile dropdown menu
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Checks if the link matches the current path
  const isActive = (path) => 
  location.pathname === path 
    ? "text-blue-600 font-semibold border-b-2 border-blue-600"  // Active state with blue text and underline
    : "text-gray-900 hover:bg-blue-100 hover:text-blue-600 transition-transform duration-300 rounded";  // Normal and hover state

  const renderLinks = () => {
    const commonLinks = [
      // Keep the About button at the end of the list
      <Link to="/about-us" className={`py-2 ${isActive("/about-us")}`}>About</Link>
    ];

    if (user?.accountType === "seeker") {
      return [
        <Link to="/" className={`py-2 ${isActive("/find-projects")}`}>Find Internships</Link>,
        <Link to="/companies" className={`py-2 ${isActive("/companies")}`}>Companies / Professors</Link>,
        <Link to="/applications" className={`py-2 ${isActive("/applications")}`}>My Applications</Link>,
        ...commonLinks  // Append the commonLinks array here
      ];
    }

    if (user?.accountType === "admin") {
      return [
        <Link to="/student-list" className={`py-2 ${isActive("/student-list")}`}>Student List</Link>,
        <Link to="/company-professor-list" className={`py-2 ${isActive("/company-professor-list")}`}>Professor / Company List</Link>,
        <Link to="/uploaded-list" className={`py-2 ${isActive("/uploaded-list")}`}>Uploaded List</Link>,
        <Link to="/admin-applications" className={`py-2 ${isActive("/admin-applications")}`}>Student Applications</Link>,
        ...commonLinks  // Append the commonLinks array here
      ];
    }

    if (user?.accountType === "company") {
      return [
        <Link to="/upload-project" className={`py-2 ${isActive("/upload-project")}`}>Post a Project</Link>,
        <Link to="/student-applications" className={`py-2 ${isActive("/student-applications")}`}>Applications</Link>,
        ...commonLinks  // Append the commonLinks array here
      ];
    }
  };

  return (
    <div className="relative bg-[#f7fdfd] z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-5">
        {/* Logo Section */}
        <div>
          <Link
            to="/"
            className="text-blue-600 font-bold text-2xl hover:scale-110 transform transition-transform"
          >
            Portal<span className="text-[#1677cccb]">X</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8 items-center text-base font-medium text-slate-700">
          {user?.email && renderLinks()}
        </ul>

        {/* Profile Section */}
        <div className="hidden lg:block">
          {!user?.token ? (
            <Link to="/user-auth">
              <CustomButton
                title="Sign In"
                containerStyles="text-blue-600 py-1.5 px-5 border border-blue-600 rounded-full hover:bg-blue-700 hover:text-white"
              />
            </Link>
          ) : (
            <MenuList user={user} isProfileOpen={isProfileOpen} onClick={handleProfileClick} />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="block lg:hidden" onClick={handleCloseNavbar}>
          {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-start bg-[#f7fdfd] container mx-auto px-5 py-5">
          {user?.email && renderLinks()}
          <div className="w-full py-4">
            {!user?.token ? (
              <Link to="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles="text-blue-600 py-1.5 px-5 border border-blue-600 rounded-full hover:bg-blue-700 hover:text-white"
                />
              </Link>
            ) : (
              <MenuList user={user} isProfileOpen={isProfileOpen} onClick={handleProfileClick} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
