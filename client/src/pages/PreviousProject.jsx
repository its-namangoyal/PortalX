import React, { useState, useEffect } from "react";

const PreviousProjects = () => {
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch previous projects from the backend API
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/previous");
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        setError("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="previous-projects">
      <h1>Previous Projects</h1>
      {Object.keys(projects).length === 0 ? (
        <p>No projects available</p>
      ) : (
        Object.keys(projects).map((semesterYear) => (
          <div key={semesterYear} className="semester-section">
            <h2>{semesterYear}</h2>
            <ul>
              {projects[semesterYear].map((project) => (
                <li key={project.projectID}>
                  <strong>{project.projectID}:</strong> {project.title}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default PreviousProjects;