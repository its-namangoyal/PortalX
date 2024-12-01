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
    <div className="p-8 bg-gradient-to-r from-blue-50 via-gray-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
        Admin Projects
      </h1>

      {loading ? (
        <div className="text-center text-xl text-gray-600 animate-pulse">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              Projects
            </h2>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found.</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className="cursor-pointer p-5 mb-4 bg-gray-100 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {project.projectTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Applications: {project.applicationCount || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Company: {project.company?.name || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Project Details and Applications */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            {selectedProject ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                  Project Details
                </h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {selectedProject.projectTitle}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Company", value: selectedProject.company?.name },
                      { label: "Location", value: selectedProject.company?.location },
                      { label: "Salary", value: `$${selectedProject.salary || "N/A"}` },
                      { label: "Project Type", value: selectedProject.projectType },
                      { label: "Vacancies", value: selectedProject.vacancies },
                      { label: "Experience Required", value: `${selectedProject.experience || 0} year(s)` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="font-medium text-gray-800">{value || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                  Applications ({applications.length})
                </h3>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application._id}
                        className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {application.student.firstName} {application.student.lastName}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {application.student.email}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              application.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : application.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Select a project to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
