import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/project-applications');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      } else {
        console.error('Error fetching projects:', data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  if (!user || user.accountType !== 'admin') {
    return <div>Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Applications</h2>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project._id} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-bold">{project.projectTitle}</h3>
                <div className="mt-2">
                  <p className="font-semibold">Description:</p>
                  <p className="text-gray-600">{project.detail.desc}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Requirements:</p>
                  <p className="text-gray-600">{project.detail.requirements}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Applications:</p>
                  {project.application.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {project.application.map((applicant) => (
                        <li key={applicant._id} className="text-gray-600">
                          {applicant.firstName} {applicant.lastName} ({applicant.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No applications submitted yet.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found with applications.</p>
        )}
      </section>
    </div>
  );
}

export default Admin;
