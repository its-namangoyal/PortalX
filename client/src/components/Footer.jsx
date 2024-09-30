import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import { footerLinks } from "../utils/data";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";
import uwinLogo from "D:/UWindsor/Project - Final Sem/PortalX/client/src/assets/uw logo.png"; // Import the logo

const Footer = () => {
  return (
    <footer
      className="text-white mp-20"
      style={{
        fontFamily:
          "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
      }}
    >
      <div className="overflow-x-hidden -mb-0.5">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            fill: "#1d4ed8",
            width: "125%",
            height: 112,
            transform: "rotate(180deg)",
          }}
        >
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
        </svg>
      </div>

      <div className="bg-[#1d4ed8]">
        {/* University Logo */}
        <img
          src={uwinLogo}
          alt="University of Windsor Logo"
          className="mx-auto mb-6 pt-5 w-64"
          style={{
            width: 120
          }}
        />
        <div className="text-center mb-5">
          {/* Licensing and Copyright */}
          <p className="text-black-700 text-sm font-light">
            &copy; {new Date().getFullYear()} PortalX. All rights reserved.
          </p>
          <p className="text-black-600 text-sm mt-2 font-light">
            Designed and Developed by the University of Windsor.
          </p>
        </div>

        {/* Bottom Decoration */}
        <div className="bg-[#001a36] py-4">
          <div className="container mx-auto px-5">
            <p className="text-black-700 text-center text-s">
              PortalX is a project developed as part of the University of
              Windsor's MAC Program.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
