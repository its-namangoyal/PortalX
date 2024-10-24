import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { apiRequest } from "../utils"; // Ensure this imports your apiRequest function
import Loading from "../components/Loading"; // Adjust the import path as needed

const StudentApplications = () => {
  const { user } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate hook

  const fetchApplications = async () => {
    try {
      const response = await apiRequest({
        url: `/companies/${user?._id}/applications`, // Ensure this matches your route
        method: "GET",
      });

      console.log(response); // Log the entire response

      if (response && response.success) {
        setApplications(response.data);
      } else {
        setApplications([]); // If no applications, set to empty
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600"; // Yellow background for pending
      case "accepted":
        return "bg-green-100 text-green-600"; // Green background for accepted
      case "rejected":
        return "bg-red-100 text-red-600"; // Red background for rejected
      default:
        return "bg-gray-100 text-gray-600"; // Default for any other status
    }
  };

  const handleApplicationClick = (applicationId) => {
    navigate(`/applications/${applicationId}`); // Redirect to ApplicationDetails page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Applications for Your Projects
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleApplicationClick(application._id)} // Handle click to navigate
            >
              <h2 className="text-xl font-semibold mb-2">
                {application.project.projectTitle}
              </h2>
              <p className="text-gray-700 mb-1">
                Applicant:{" "}
                <span className="font-medium">
                  {application.student.firstName} {application.student.lastName}
                </span>
              </p>
              <p className="text-gray-600 mb-1">
                Email:{" "}
                <span className="font-medium">{application.student.email}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Applied on:{" "}
                <span className="font-medium">
                  {new Date(application.appliedDate).toLocaleDateString()}
                </span>
              </p>

              <div
                className={`mt-2 p-2 rounded ${getStatusClass(
                  application.status
                )}`}
              >
                Status:{" "}
                <span className="font-semibold">{application.status}</span>
              </div>
              <p className="text-gray-600 mt-1">
                Semester:{" "}
                <span className="font-medium">
                  {application.project.semester}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
