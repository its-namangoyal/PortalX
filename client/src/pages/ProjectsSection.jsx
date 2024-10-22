import React, { useEffect, useState } from 'react';

// Function to fetch projects from MongoDB
const fetchProjects = async () => {
    try {
        const response = await fetch('/api/projects'); // Replace with your actual API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.projects; // Adjust based on your API response structure
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [category, setCategory] = useState('All');

  // Fetch the projects from the database on component mount
  useEffect(() => {
    const getProjects = async () => {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects); // Initially display all projects
    };

    getProjects();
  }, []);

  // Filter projects based on category
  useEffect(() => {
    filterProjects(category);
  }, [category, projects]);

  const filterProjects = (selectedCategory) => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else if (selectedCategory === 'Current') {
      const currentProjects = projects.filter(project => project.term === 'Fall 2024');
      setFilteredProjects(currentProjects);
    } else {
      const filtered = projects.filter(project => project.term === selectedCategory);
      setFilteredProjects(filtered);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Projects</h1>

      {/* Category Tabs */}
      <div className="flex gap-5 mb-5">
        {['All', 'Current', 'Summer 2024', 'Winter 2024', 'Fall 2023', 'Summer 2023', 'Winter 2023'].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Display projects or No Projects Found */}
      {filteredProjects.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(project => (
            <li key={project.projectId} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.term}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found in this category.</p>
      )}
    </div>
  );
};

export default ProjectsSection;