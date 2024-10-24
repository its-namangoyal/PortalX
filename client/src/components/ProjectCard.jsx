import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProjectCard = ({ project, currentUser }) => {
  const hasApplied = project?.hasApplied;
  const applicationStatus = project?.status; // Get the application status
  const isApplyDisabled = currentUser?.semester !== project.semester;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Link
      to={`/project-detail/${project?._id}`}
      className="block overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start space-x-4">
          <img
            src={project?.logo || noLogo}
            alt={project?.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
              {project?.projectTitle}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>{moment(project?.createdAt).fromNow()}</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600 font-medium">
                Semester {project.semester}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {project?.detail[0]?.desc?.slice(0, 150) + "..."}
        </p>

        {/* Action Section */}
        {currentUser?.accountType === "seeker" && ( // Only show for 'seeker' account type
          <div className="mt-6">
            {hasApplied && applicationStatus ? ( // Check if the user has applied and if status exists
              <span className={`text-sm ${getStatusColor(applicationStatus)}`}>
                Status: {applicationStatus}
              </span>
            ) : (
              <button
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isApplyDisabled || hasApplied
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                }`}
                disabled={isApplyDisabled || hasApplied}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isApplyDisabled && !hasApplied) {
                    window.location.href = `/project-detail/${project?._id}`;
                  }
                }}
                title={
                  isApplyDisabled
                    ? "Your semester doesn't match the project semester"
                    : hasApplied
                    ? "Application already submitted"
                    : ""
                }
              >
                {hasApplied ? (
                  <span className="text-yellow-600 font-semibold">
                    {applicationStatus} {/* Change to show application status */}
                  </span>
                ) : (
                  "Apply Now"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;