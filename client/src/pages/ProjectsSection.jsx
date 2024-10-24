import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils';  // Assuming this is the correct import
import { useSelector } from 'react-redux'; // Assuming you're using redux to get user data
import { useLocation, useNavigate } from 'react-router-dom'; // For URL navigation and updating
import Loading from '../components/Loading'; // Assuming you have a Loading component

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]); // All projects fetched from the database
  const [filteredProjects, setFilteredProjects] = useState([]); // Projects filtered by category
  const [category, setCategory] = useState('All'); // Current category
  const [isFetching, setIsFetching] = useState(false); // Loading state
  const [recordCount, setRecordCount] = useState(0); // Total number of filtered projects
  const [numPage, setNumPage] = useState(1); // Number of pages for pagination
  const [page, setPage] = useState(1); // Current page number

  const user = useSelector(state => state.user); // Assuming user data is in Redux store
  const location = useLocation();
  const navigate = useNavigate();

  // // Fetch projects from the server and filter based on the user's semester
  // const fetchProjects = async () => {
  //   setIsFetching(true);

  //   // Construct the URL using updateURL for pagination and filtering
  //   const newURL = `?page=${page}`; // Adjust this URL as needed to include pagination/filtering

  //   try {
  //     const res = await apiRequest({
  //       url: '/projects' + newURL, // Use the constructed URL
  //       method: 'GET',
  //     });

  //     console.log("API Response:", res); // Log the entire response to inspect the data

  //     if (res?.data) {
  //       // Filter projects based on the user's semester, if needed
  //       const filteredBySemester = res.data.filter(project => project.semester === user.semester);

  //       console.log("Filtered Projects:", filteredBySemester); // Log filtered projects

  //       setNumPage(res?.numOfPage || 1); // Update total pages if provided by API
  //       setRecordCount(filteredBySemester.length); // Update the record count
  //       setProjects(filteredBySemester); // Set projects fetched from the API
  //       setFilteredProjects(filteredBySemester); // Initially display all projects
  //     }
  //   } catch (error) {
  //     console.log("API Error:", error); // Log the error to inspect the problem
  //   } finally {
  //     setIsFetching(false); // Stop fetching
  //   }
  // };
  // Fetch Projects
  const fetchProjects = async () => {
    setIsFetching(true);
    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: projectLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      exp: filterExp,
    });

    try {
      const res = await apiRequest({
        url: "/projects" + newURL,
        method: "GET",
      });

      const filteredProjects = res.data.filter(project => project.semester === user.semester);
      setNumPage(res?.numOfPage);
      setRecordCount(filteredProjects.length);
      setData(filteredProjects);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  // Filter projects based on selected category
  const filterProjects = (selectedCategory) => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects); // Display all projects
    } else if (selectedCategory === 'Current') {
      const currentProjects = projects.filter(project => project.term === 'Fall 2024');
      setFilteredProjects(currentProjects);
    } else {
      const filtered = projects.filter(project => project.term === selectedCategory);
      setFilteredProjects(filtered);
    }
  };

  // Fetch projects from the database on component mount and when page/category changes
  useEffect(() => {
    fetchProjects();
  }, [page, category]); // Refetch projects when page or category changes

  useEffect(() => {
    filterProjects(category);
  }, [category, projects]); // Refetch filtered projects when category or projects list changes

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