import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { AiOutlineClose, AiOutlineLogout, AiOutlineSearch } from "react-icons/ai";
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
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow hover:bg-gray-200 transition duration-200"
        onClick={onClick}
      >
        <div className="text-left">
          <p className="text-sm font-medium">{user?.firstName || user?.name}</p>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        {user?.profileUrl ? (
          <img
            src={user?.profileUrl}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
            {user?.firstName?.[0] || user?.name?.[0]}
          </div>
        )}
        <BiChevronDown
          className={`text-lg transition-transform ${
            isProfileOpen ? "rotate-180" : ""
          }`}
        />
      </Menu.Button>

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
                        ? "professor-profile"
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

const Navbar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-blue-600 text-2xl font-bold">
          Portal<span className="text-indigo-500">X</span>
        </Link>

        <ul className="hidden lg:flex gap-8 text-gray-700 font-medium items-center">
          {user?.accountType === "seeker" && (
            <>
              <li>
                <Link to="/">Find Internships</Link>
              </li>
              <li>
                <Link to="/companies">Companies / Professors</Link>
              </li>
              <li>
                <Link to="/applications">My Applications</Link>
              </li>
            </>
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
          {user?.accountType === "admin" && (
            <>
              <li>
                <Link to="/student-list">Students List</Link>
              </li>
              <li>
                <Link to="/company-professor-list">Professors / Companies</Link>
              </li>
              <li>
                <Link to="/admin-applications">Applications</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/about-us">About</Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="absolute -top-10 w-64 py-2 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg transition-all duration-300 focus:outline-none"
              />
            )}
            <AiOutlineSearch
              className="text-xl text-gray-600 cursor-pointer"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            />
          </div>
          {!user?.token ? (
            <Link to="/user-auth">
              <CustomButton
                title="Sign In"
                containerStyles="text-blue-600 px-5 py-2 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
              />
            </Link>
          ) : (
            <MenuList
              user={user}
              isProfileOpen={isProfileOpen}
              onClick={toggleProfileMenu}
            />
          )}
        </div>

        <button
          className="lg:hidden text-gray-700"
          onClick={toggleNavbar}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </nav>

      {isOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 px-4 py-2">
            {user?.accountType === "seeker" && (
              <>
                <li>
                  <Link to="/">Find Internships</Link>
                </li>
                <li>
                  <Link to="/companies">Companies / Professors</Link>
                </li>
                <li>
                  <Link to="/applications">My Applications</Link>
                </li>
              </>
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
            {user?.accountType === "admin" && (
              <>
                <li>
                  <Link to="/student-list">Students List</Link>
                </li>
                <li>
                  <Link to="/company-professor-list">Professors / Companies</Link>
                </li>
                <li>
                  <Link to="/admin-applications">Applications</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/about-us">About</Link>
            </li>
          </ul>
          {!user?.token && (
            <div className="px-4">
              <Link to="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles="text-blue-600 px-5 py-2 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
                />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;