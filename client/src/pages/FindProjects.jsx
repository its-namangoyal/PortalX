import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CustomButton, ProjectCard, ListBox, Loading } from "../components";
import Header from "../components/Header";
import { apiRequest, updateURL } from "../utils";
import { experience } from "../utils/data";

const FindProjects = () => {
  // State management
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [applications, setApplications] = useState([]); // Store user's applications
  const [searchQuery, setSearchQuery] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [filterExp, setFilterExp] = useState("");
  const [expVal, setExpVal] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Fetch projects and user applications
  const fetchProjectsAndApplications = async () => {
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
      // Fetch projects
      const projectsRes = await apiRequest({
        url: "/projects" + newURL,
        method: "GET",
      });

      // Fetch user's applications
      const appsRes = await apiRequest({
        url: `/applications/user/${user?._id}`, // Fetch applications for the logged-in user
        method: "GET",
      });

      const filteredProjects = projectsRes.data.filter(
        (project) => project.semester === user.semester
      );

      setNumPage(projectsRes?.numOfPage || 1);
      setRecordCount(filteredProjects.length);
      setData(filteredProjects);
      setApplications(appsRes?.data || []); // Store user's applications

    } catch (error) {
      console.error("Error fetching projects or applications:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Filter by experience
  const filterExperience = (e) => {
    const selectedExp = e.target.value;
    setExpVal((prevExpVal) =>
      prevExpVal.includes(selectedExp)
        ? prevExpVal.filter((exp) => exp !== selectedExp)
        : [...prevExpVal, selectedExp]
    );
  };

  // Handle form submit to search projects
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchProjectsAndApplications();
  };

  // Handle "Show More" functionality for pagination
  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prevPage) => prevPage + 1);
  };

  // Update experience filter based on selected values
  useEffect(() => {
    if (expVal.length > 0) {
      const ranges = expVal.map((el) => el.split("-").map(Number));
      const minExp = Math.min(...ranges.map(([min]) => min));
      const maxExp = Math.max(...ranges.map(([, max]) => max));
      setFilterExp(`${minExp}-${maxExp}`);
    }
  }, [expVal]);

  // Fetch projects and applications on component mount or when page/sort changes
  useEffect(() => {
    if (user?.semester) {
      fetchProjectsAndApplications();
    }
  }, [sort, filterExp, page, user?.semester]);

  return (
    <div>
      {/* Header Section */}
      <Header
        title="Find Your Dream Internship with Ease"
        type="home"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={projectLocation}
        setLocation={setProjectLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]">
        {/* Filters Section */}
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm">
          <p className="text-lg font-semibold text-slate-600">Filter by Experience</p>
          <div className="flex flex-col gap-2">
            {experience.map((exp) => (
              <label key={exp.title} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  value={exp.value}
                  className="w-4 h-4"
                  onChange={filterExperience}
                />
                <span>{exp.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="w-full md:w-5/6 px-5 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm md:text-base">
              Showing: <span className="font-semibold">{recordCount}</span> Internships Available
            </p>
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
              <p className="text-sm md:text-base">Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          {/* Projects List */}
          <div className="w-full flex flex-wrap gap-4">
            {data?.map((project, index) => {
              const hasApplied = applications?.some(
                (application) => application.project._id === project._id
              );
              const newProject = {
                name: project?.company?.name,
                logo: project?.company?.profileUrl,
                hasApplied,
                status: hasApplied
                  ? applications.find((app) => app.project._id === project._id)?.status
                  : null,
                ...project,
              };

              return (
                <ProjectCard
                  project={newProject}
                  key={index}
                  currentUser={user}
                />
              );
            })}
          </div>

          {/* Loading Spinner */}
          {isFetching && (
            <div className="py-10">
              <Loading />
            </div>
          )}

          {/* Load More Button */}
          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={handleShowMore}
                title="Load More"
                containerStyles="text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindProjects;