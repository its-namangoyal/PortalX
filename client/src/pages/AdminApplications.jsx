// AdminApplications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://localhost:8800/api-v1/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications.");
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
    }
  };

  const handleApplicationClick = (applicationId) => {
    navigate(`/applications/${applicationId}`); // Redirect to ApplicationDetails page
  };

  const getApprovalStatus = (isApproved) => {
    return isApproved ? (
      <span className="text-green-600 font-semibold">Accepted</span>
    ) : (
      <span className="text-red-600 font-semibold">Rejected</span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin - Applications</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleApplicationClick(application._id)} // Make the card clickable
            >
              <h2 className="text-xl font-semibold mb-2">
                Project: {application.project?.projectTitle}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Student Name:</strong> {application.student?.firstName} {application.student?.lastName}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Student Email:</strong> {application.student?.email}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Admin Approval:</strong> {getApprovalStatus(application.adminApproval)}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Applied Date:</strong>{" "}
                {new Date(application.appliedDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-10">No applications found.</p>
      )}
    </div>
  );
};

export default AdminApplications;
