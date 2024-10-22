import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils';  // Assuming this is the correct import
import { useSelector } from 'react-redux'; // Assuming you're using redux to get user data
import { useLocation, useNavigate } from 'react-router-dom'; // For URL navigation and updating
import Loading from '../components/Loading'; // Assuming you have a Loading component

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [category, setCategory] = useState('All');
  const [isFetching, setIsFetching] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [numPage, setNumPage] = useState(1);
  const [page, setPage] = useState(1);

  const user = useSelector(state => state.user); // Assuming user data is in Redux store
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data for testing
  useEffect(() => {
    const mockProjects = [
      { projectId: "1", title: "Mock Project 1", term: "Fall 2024" },
      { projectId: "2", title: "Mock Project 2", term: "Winter 2023" },
      { projectId: "3", title: "Mock Project 3", term: "Summer 2023" },
    ];
    
    // Uncomment the following lines to test with mock data
    // setProjects(mockProjects); 
    // setFilteredProjects(mockProjects);
  }, []);

  // Fetch projects from the server and filter based on the user's semester
  const fetchProjects = async () => {
    setIsFetching(true);

    // Construct the URL using updateURL for pagination and filtering
    const newURL = ""; // You can use updateURL here for proper filtering and pagination

    try {
      const res = await apiRequest({
        url: '/projects' + newURL, // Use the constructed URL
        method: 'GET',
      });

      console.log("API Response:", res); // Log the entire response to inspect the data

      // Filter projects based on user's semester
      const filteredProjects = res.data.filter(project => project.semester === user.semester);

      console.log("Filtered Projects:", filteredProjects); // Check the filtered projects

      setNumPage(res?.numOfPage);
      setRecordCount(filteredProjects.length);
      setProjects(filteredProjects); // Set filtered projects as the main project state

      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log("API Error:", error); // Log the error to inspect the problem
    }
  };

  // Fetch the projects from the database on component mount and when page/category changes
  useEffect(() => {
    fetchProjects();
  }, [page, category]); // Refetch projects when page or category changes

  // Filter projects based on selected category
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

    console.log("Filtered Projects after category:", filteredProjects);
  };

  useEffect(() => {
    filterProjects(category);
  }, [category, projects]);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Projects</h1>

      {/* Category Tabs */}
      <div className="flex gap-5 mb-5">
        {['All', 'Current', 'Summer 2024', 'Winter 2024', 'Fall 2023', 'Summer 2023', 'Winter 2023'].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setCategory(cat)} // Change the category and refetch projects
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Show loading indicator while fetching */}
      {isFetching ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}

      {/* Pagination if needed */}
      {numPage > page && !isFetching && (
        <div className="w-full flex items-center justify-center pt-10">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setPage(page + 1)} // Load the next page of projects
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;