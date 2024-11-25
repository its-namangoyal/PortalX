import uwinLogo from "../assets/uw logo.png"; // Import the logo

const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{
        fontFamily:
          "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
      }}
    >
      {/* Footer Container */}
      <div className="flex justify-center items-center py-4">
        {/* University Logo */}
        <img
          src={uwinLogo}
          alt="University of Windsor Logo"
          className="w-20 h-20 mr-2"
        />
        {/* Footer Text */}
        <p className="text-gray-600 text-md font-light">
          &copy; {new Date().getFullYear()} PortalX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
