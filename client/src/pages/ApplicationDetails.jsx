import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Import the toast function
import { apiRequest } from "../utils"; // Ensure this imports your apiRequest function
import Loading from "../components/Loading"; // Adjust the import path as needed

const ApplicationDetails = () => {
  const { applicationId } = useParams(); // Get applicationId from URL params
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch application details
  const fetchApplicationDetails = async () => {
    try {
      const response = await apiRequest({
        url: `/applications/${applicationId}`, // API to fetch application by ID
        method: "GET",
      });

      if (response && response.success) {
        setApplication(response.data);
      } else {
        setApplication(null);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching application details:", error);
      setIsLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (status) => {
    try {
      const response = await apiRequest({
        url: `/applications/${applicationId}/update-status`, // API to update application status
        method: "POST",
        data: { status },
      });

      if (response && response.success) {
        setApplication({ ...application, status });
        toast.success(`Application ${status === "accepted" ? "Accepted" : "Rejected"} Successfully`);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("An error occurred while updating the status.");
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  if (isLoading) {
    return <Loading />;
  }

  if (!application) {
    return <p className="text-gray-500">Application not found.</p>;
  }

  const { student, project, status } = application;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Application Details</h1>

      <div className="bg-white shadow-xl rounded-lg p-6 relative overflow-hidden">
        {/* Project Title and Applicant Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">{project.projectTitle}</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold">Applicant Information</h3>
              <p className="text-gray-700">
                Name: <span className="font-medium">{student.firstName} {student.lastName}</span>
              </p>
              <p className="text-gray-700">Email: {student.email}</p>
              <p className="text-gray-700">Applied on: {new Date(application.appliedDate).toLocaleDateString()}</p>
              <p className="text-gray-700">Semester: {project.semester}</p>
            </div>
            <div className="flex flex-col items-start">
              <a
                href={student.cvUrl}
                download
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Application Status</h3>
          <p className={`text-lg font-bold mb-4 ${status === "accepted" ? "text-green-500" : status === "rejected" ? "text-red-500" : "text-yellow-500"}`}>
            {status.toUpperCase()}
          </p>
        </div>

        {/* Accept/Reject Buttons */}
        {status === "pending" && (
          <div className="flex gap-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateApplicationStatus("accepted")}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateApplicationStatus("rejected")}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
