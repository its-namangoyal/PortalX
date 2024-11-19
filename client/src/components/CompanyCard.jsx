import React from "react";
import { Link } from "react-router-dom";

const defaultLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const CompanyCard = ({ cmp }) => {
  const { _id, profileUrl, name, email, location, projectPosts } = cmp || {};

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:justify-between p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out space-y-4 md:space-y-0">
      {/* Company Info */}
      <div className="flex items-center gap-6 w-full md:w-2/3">
        <Link to={`/company-profile/${_id}`} className="flex items-center gap-4 group">
          <img
            src={profileUrl || defaultLogo}
            alt={name || "Company Logo"}
            className="w-16 h-16 rounded-lg border object-cover shadow-sm group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-300"
          />
        </Link>

        <div className="flex flex-col truncate">
          <Link
            to={`/company-profile/${_id}`}
            className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 hover:underline transition-all duration-200"
          >
            {name || "Unknown Company"}
          </Link>
          <span
            className="text-sm text-blue-600 truncate"
            title={email || "No Email Available"}
          >
            {email || "No Email Available"}
          </span>
        </div>
      </div>

      {/* Company Location */}
      <div className="w-full md:w-1/4 text-center md:text-left">
        <p
          className="text-sm text-gray-600 truncate"
          title={location || "No Location"}
        >
          {location || "No Location"}
        </p>
      </div>

      {/* Projects Count */}
      <div className="flex flex-col items-center w-full md:w-1/4">
        <p className="text-blue-600 text-2xl font-bold">
          {projectPosts?.length || 0}
        </p>
        <span className="text-sm text-gray-500">Projects Posted</span>
      </div>
    </div>
  );
};

export default CompanyCard;