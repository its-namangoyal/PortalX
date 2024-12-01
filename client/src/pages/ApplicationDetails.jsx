import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { apiRequest } from "../utils";
import Loading from "../components/Loading";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplicationDetails = async () => {
    try {
      const response = await apiRequest({
        url: `/applications/${applicationId}`,
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

  const updateAdminApproval = async (approvalStatus) => {
    try {
      const response = await apiRequest({
        url: `/applications/${applicationId}/update-admin-approval`,
        method: "POST",
        data: { adminApproval: approvalStatus === "Accepted" },
      });

      if (response && response.success) {
        setApplication({ ...application, adminApproval: approvalStatus === "Accepted" });
        toast.success(`Admin Approval updated to ${approvalStatus}`);
      } else {
        toast.error("Failed to update Admin Approval status");
      }
    } catch (error) {
      console.error("Error updating Admin Approval:", error);
      toast.error("An error occurred while updating the Admin Approval status.");
    }
  };

  const updateApplicationStatus = async (status) => {
    try {
      const response = await apiRequest({
        url: `/applications/${applicationId}/update-status`,
        method: "POST",
        data: { status },
      });

      if (response && response.success) {
        setApplication({ ...application, status });
        toast.success(`Application status updated to ${status}`);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("An error occurred while updating the application status.");
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

  const { student, project, status, adminApproval } = application;

  // Determine status class based on application status
  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-500"; // Green for accepted
      case "pending":
        return "text-yellow-500"; // Yellow for pending
      case "rejected":
        return "text-red-500"; // Red for rejected
      default:
        return "text-gray-500"; // Default color
    }
  };

  return (
    <div className="container mx-auto px-10 py-8">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Application Details</h1>

      {/* Main content wrapper */}
      <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
        {/* Project Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">{project.projectTitle}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Applicant Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Name: <span className="font-medium">{student.firstName} {student.lastName}</span>
                </p>
                <p className="text-gray-700">Email: {student.email}</p>
                <p className="text-gray-700">Applied on: {new Date(application.appliedDate).toLocaleDateString()}</p>
                <p className="text-gray-700">Semester: {project.semester}</p>
              </div>
              <div className="mt-4">
                <a
                  href={student.cvUrl}
                  download
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
                >
                  Download Resume
                </a>
              </div>
            </div>

            {/* Student Profile Picture */}
            <div className="flex flex-col items-center justify-center">
              <img
                src={student.profileUrl || noLogo}
                alt="Student Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <p className="text-lg font-semibold text-gray-700">{student.firstName} {student.lastName}</p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            {user.accountType === "admin" ? "Admin Approval" : "Application Status"}
          </h3>
          <p
            className={`text-lg font-bold mb-4 ${getStatusClass(user.accountType === "admin" ? adminApproval : status)}`}
          >
            {(user.accountType === "admin"
              ? adminApproval
              : status
            ).toString().toUpperCase()}
          </p>
        </div>

        {/* Admin controls */}
        {user.accountType === "admin" && (
          <div className="flex gap-6 mt-6 justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-1/3"
              onClick={() => updateAdminApproval("Accepted")}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-1/3"
              onClick={() => updateAdminApproval("Rejected")}
            >
              Reject
            </button>
          </div>
        )}

        {/* Company controls */}
        {user.accountType === "company" && (
          <div className="flex gap-8 mt-6 justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-1/3"
              onClick={() => updateApplicationStatus("accepted")}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-1/3"
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
