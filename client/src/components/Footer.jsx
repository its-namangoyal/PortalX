import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import uwinLogo from "../assets/uw logo.png"; // Import the logo

const Footer = () => {
  return (
    <footer
      className="text-white"
      style={{
        fontFamily: "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
      }}
    >
      {/* Background SVG */}
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
        <div className="flex justify-center pt-5 mb-6">
          <img
            src={uwinLogo}
            alt="University of Windsor Logo"
            className="w-28 h-auto"
          />
        </div>

        {/* Licensing and Copyright */}
        <div className="text-center mb-5">
          <p className="text-gray-200 text-sm font-light">
            &copy; {new Date().getFullYear()} PortalX. All rights reserved.
          </p>
          <p className="text-gray-300 text-sm mt-2 font-light">
            Designed and Developed by the University of Windsor.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 text-lg text-white mb-8">
          <a href="https://www.facebook.com/UWindsor" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebookF className="hover:text-gray-300 transition duration-300 ease-in-out" />
          </a>
          <a href="https://www.instagram.com/uwincoop?igsh=N2g2Y3l2anBsYWFp" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FiInstagram className="hover:text-gray-300 transition duration-300 ease-in-out" />
          </a>
          <a href="https://www.linkedin.com/company/uwindsorcoop/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn className="hover:text-gray-300 transition duration-300 ease-in-out" />
          </a>
          {/* <a href="https://x.com/UWindsor" target="_blank" rel="noreferrer" aria-label="Twitter">
            <FaTwitter className="hover:text-gray-300 transition duration-300 ease-in-out" />
          </a>  */}
        </div>

        {/* Bottom Section */}
        <div className="bg-[#001a36] py-4">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>
              PortalX is a project developed as part of the University of Windsor's MAC Program.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;