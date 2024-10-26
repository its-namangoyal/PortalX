import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import uwinLogo from "../assets/uw logo.png"; // Import the logo

const Footer = () => {
  return (
    <footer
      className="text-white w-full"
      style={{
        fontFamily:
          "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
      }}
    >
      {/* Footer Container */}
      <div className="bg-[#1d4ed8] flex flex-col min-h-[150px]">
        
        {/* University Logo and Licensing Text */}
        <div className="flex justify-center items-center px-4 py-4"> 
          {/* Logo on the left */}
          <img
            src={uwinLogo}
            alt="University of Windsor Logo"
            className="w-20 h-20 mr-2"
          />
          
          {/* Licensing and Social Icons on the right */}
          <div className="flex flex-col ml-2 mt-2">
            <div className="text-center mb-1">
              <p className="text-gray-200 text-sm font-light">
                &copy; {new Date().getFullYear()} PortalX. All rights reserved.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4 text-lg text-white mb-4">
              <a
                href="https://www.facebook.com/UWindsor"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF className="hover:text-gray-300 transition duration-300 ease-in-out" />
              </a>
              <a
                href="https://www.instagram.com/uwincoop?igsh=N2g2Y3l2anBsYWFp"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FiInstagram className="hover:text-gray-300 transition duration-300 ease-in-out" />
              </a>
              <a
                href="https://www.linkedin.com/company/uwindsorcoop/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="hover:text-gray-300 transition duration-300 ease-in-out" />
              </a>
              {/* Uncomment for Twitter */}
              {/* <a href="https://x.com/UWindsor" target="_blank" rel="noreferrer" aria-label="Twitter">
                <FaTwitter className="hover:text-gray-300 transition duration-300 ease-in-out" />
              </a> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-[#001a36] py-3 w-full">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>
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
