import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProjectCard = ({ project, currentUser }) => {
  const hasApplied = project?.hasApplied;
  const applicationStatus = project?.status;
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

  const getTimeAgoShort = (date) => {
    const now = moment();
    const duration = moment.duration(now.diff(moment(date)));

    if (duration.asDays() >= 1) {
      return `${Math.floor(duration.asDays())}d+`;
    } else if (duration.asHours() >= 1) {
      return `${Math.floor(duration.asHours())}h+`;
    } else {
      return `${Math.floor(duration.asMinutes())}m+`;
    }
  };

  return (
    <Link
      to={`/project-detail/${project?._id}`}
      className="block overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
      style={{ width: "350px", height: "auto" }}
    >
      <div className="p-4 flex justify-between items-center">
        {/* Left Section with Logo and Info */}
        <div className="flex items-center space-x-4">
          <img
            src={project?.logo || noLogo}
            alt={project?.company?.name || project?.companyName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="text-sm text-gray-600">
              {project?.company?.name || project?.companyName}
            </div>
            <div className="flex justify-between items-center" style={{ width: "250px", height: "auto" }}>
              <h3 className="text-base font-semibold text-gray-900">
                {project?.projectTitle || "Untitled Project"}
              </h3>
              <div className="text-sm text-gray-500 ml-10">
                {getTimeAgoShort(project?.createdAt)}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {project?.company?.location || project?.location || "Unknown location"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ${project?.salary || "N/A"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {project?.semester || "Not specified"} {/* Semester Info */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
