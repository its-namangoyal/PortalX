import React from "react";
import { Link } from "react-router-dom";

const defaultLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const CompanyCard = ({ cmp }) => {
  const { _id, profileUrl, name, email, location, projectPosts } = cmp || {};

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out">
      {/* Company Info */}
      <div className="flex items-center gap-4 w-full md:w-2/3">
        <Link to={`/company-profile/${_id}`} className="flex items-center gap-4">
          <img
            src={profileUrl || defaultLogo}
            alt={name || "Company Logo"}
            className="w-12 h-12 rounded object-cover"
          />
        </Link>

        <div className="flex flex-col truncate">
          <Link to={`/company-profile/${_id}`} className="text-lg font-semibold text-gray-700 truncate hover:underline">
            {name || "Unknown Company"}
          </Link>
          <span className="text-sm text-blue-600 truncate">{email || "No Email Available"}</span>
        </div>
      </div>

      {/* Company Location */}
      <div className="hidden md:block w-1/4">
        <p className="text-gray-600 text-sm">{location || "No Location"}</p>
      </div>

      {/* Projects Count */}
      <div className="flex flex-col items-center w-1/4">
        <p className="text-blue-600 text-lg font-semibold">{projectPosts?.length || 0}</p>
        <span className="text-xs text-gray-500">Projects Posted</span>
      </div>
    </div>
  );
};

export default CompanyCard;