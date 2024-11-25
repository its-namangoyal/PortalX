import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8800/api-v1",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/adminproject/projects");
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      setLoading(true);
      const response = await api.get(`/adminproject/projects/${projectId}`);
      setSelectedProject(response.data.project);
      setApplications(response.data.applications);
      setError(null);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to fetch project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Admin Projects
      </h1>

      {loading ? (
        <div className="text-center text-xl text-gray-600 animate-pulse">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects List */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Projects</h2>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found.</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className="cursor-pointer p-4 mb-3 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow hover:bg-gray-100"
                >
                  <h3 className="font-medium text-gray-800">
                    {project.projectTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Applications: {project.applicationCount || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Company: {project.company?.companyName || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Project Details and Applications */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {selectedProject ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Project Details
                </h2>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800">
                    {selectedProject.projectTitle}
                  </h3>
                  <p className="text-gray-600">
                    Company: {selectedProject.company?.companyName || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Location: {selectedProject.location || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Salary: ${selectedProject.salary || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Project Type: {selectedProject.projectType || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Vacancies: {selectedProject.vacancies || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Experience Required: {selectedProject.experience || 0} years
                  </p>
                  <p className="text-gray-600">
                    Semester: {selectedProject.semester || "N/A"}
                  </p>
                </div>

                <h3 className="font-medium text-gray-700 mb-4">
                  Applications ({applications.length})
                </h3>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications yet.</p>
                ) : (
                  applications.map((application) => (
                    <div
                      key={application._id}
                      className="border-b py-3 text-gray-700"
                    >
                      <p>
                        Student: {application.student.firstName}{" "}
                        {application.student.lastName}
                      </p>
                      <p>Email: {application.student.email}</p>
                      <p>
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            application.status === "accepted"
                              ? "text-green-600"
                              : application.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {application.status}
                        </span>
                      </p>
                      <p>
                        Applied Date:{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </>
            ) : (
              <p className="text-gray-500">Select a project to view details</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
