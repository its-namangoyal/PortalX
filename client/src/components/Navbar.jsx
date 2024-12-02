import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../redux/userSlice";

// Sidebar Component (Navbar)
const Sidebar = ({ links, onLogout, user }) => {
  return (
    <div className="h-screen w-64 bg-blue-600 text-white fixed top-0 left-0 shadow-xl z-50">
      <div className="p-6 font-bold text-3xl border-b-4 border-blue-700">
        Portal<span className="text-[#00B5E2]">X</span>
      </div>
      <ul className="p-6 space-y-2">
        {" "}
        {/* Reduced gap between links */}
        {links.map((link, index) => (
          <li key={index} className="hover:bg-white rounded-lg">
            <Link to={link.path} className="block p-4 text-lg font-semibold">
              {link.label}
            </Link>
          </li>
        ))}
        {/* Profile Option */}
        {(user?.accountType === "seeker" ||
          user?.accountType === "company") && (
          <li className="hover:bg-white rounded-lg">
            <Link
              to={
                user?.accountType === "seeker"
                  ? "/user-profile"
                  : "/professor-profile"
              }
              className="block p-4 text-lg font-semibold"
            >
              Profile
            </Link>
          </li>
        )}
      </ul>
      <div className="absolute bottom-5 w-full px-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full p-4 hover:bg-red-500 rounded-lg text-lg font-semibold transition-colors duration-300"
        >
          <AiOutlineLogout size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
};

// Main Navbar Layout with Sidebar
const NavbarLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user); // Get user data from Redux store
  const dispatch = useDispatch();

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/"); // Redirect to the home page after logout
  };

  // Sidebar links based on account type
  const getLinks = () => {
    if (user?.accountType === "seeker") {
      return [
        { path: "/", label: "Home" },
        { path: "/companies", label: "Companies" },
        { path: "/applications", label: "My Applications" },
        { path: "/about-us", label: "About" },
      ];
    } else if (user?.accountType === "admin") {
      return [
        { path: "/", label: "Home" },
        { path: "/student-list", label: "Student List" },
        { path: "/company-professor-list", label: "Company List" },
        { path: "/uploaded-list", label: "Uploaded List" },
        { path: "/admin-project", label: "Projects" },
        { path: "/admin-applications", label: "Student Applications" },
        { path: "/about-us", label: "About" },
      ];
    } else if (user?.accountType === "company") {
      return [
        { path: "/", label: "Home" },
        { path: "/upload-project", label: "Post a Project" },
        { path: "/student-applications", label: "Applications" },
        { path: "/about-us", label: "About" },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar links={links} onLogout={handleLogout} user={user} />

      {/* Main Content */}
      <div
        className={`transition-all ml-64 w-full ${
          isSidebarOpen ? "ml-0" : "ml-64"
        }`}
      >
        {/* Top Navbar for Mobile */}
        <div className="lg:hidden p-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white text-2xl"
          >
            <HiMenuAlt3 size={26} />
          </button>
          <h1 className="text-white font-bold text-2xl">
            Portal<span className="text-[#00B5E2]">X</span>
          </h1>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default NavbarLayout;
