import { useEffect, useState } from "react";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { CustomButton, ProjectCard, ListBox, Loading } from "../components";
import Header from "../components/Header";
import { apiRequest, updateURL } from "../utils";
import { experience } from "../utils/data";

const FindProjects = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [applications, setApplications] = useState([]); // State for storing user's applications

  const [searchQuery, setSearchQuery] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [filterProjectTypes, setFilterProjectTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
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
      jType: filterProjectTypes,
      exp: filterExp,
    });

    try {
      // Fetch projects
      const res = await apiRequest({
        url: "/projects" + newURL,
        method: "GET",
      });

      // Fetch user's applications
      const appsRes = await apiRequest({
        url: `/applications/user/${user?._id}`, // Fetch applications for the logged-in user
        method: "GET",
      });

      const filteredProjects = res.data.filter(
        (project) => project.semester === user.semester
      );

      setNumPage(res?.numOfPage);
      setRecordCount(filteredProjects.length);
      setData(filteredProjects);
      setApplications(appsRes?.data || []); // Store user's applications

      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.error("Error fetching projects or applications:", error);
    }
  };

  // Filter projects by type
  const filterProjects = (val) => {
    if (filterProjectTypes?.includes(val)) {
      setFilterProjectTypes(filterProjectTypes.filter((el) => el != val));
    } else {
      setFilterProjectTypes([...filterProjectTypes, val]);
    }
  };

  // Filter projects by experience
  const filterExperience = (e) => {
    if (expVal?.includes(e)) {
      setExpVal(expVal?.filter((el) => el != e));
    } else {
      setExpVal([...expVal, e]);
    }
  };

  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchProjectsAndApplications();
  };

  // Handle "Show More" click
  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal?.map((el) => {
        const newEl = el?.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal?.sort((a, b) => a - b);

      setFilterExp(`${newExpVal[0]}-${newExpVal?.length > 1 ? newExpVal[newExpVal.length - 1] : newExpVal[0]}`);
    }
  }, [expVal]);

  useEffect(() => {
    if (user?.semester) {
      fetchProjectsAndApplications();
    }
  }, [sort, filterProjectTypes, filterExp, page, user?.semester]);

  return (
    <div>
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
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm">
          <p className="text-lg font-semibold text-slate-600">Filter Search</p>

          <div className="py-2">
            {/* Experience Filter */}
            <div className="py-2 mt-0">
              <div className="flex justify-between mb-3">
                <p className="flex items-center gap-2 font-semibold">
                  <BsStars />
                  Experience
                </p>

                <button>
                  <MdOutlineKeyboardArrowDown />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {experience.map((exp) => (
                  <div key={exp.title} className="flex gap-3">
                    <input
                      type="checkbox"
                      value={exp?.value}
                      className="w-4 h-4"
                      onChange={(e) => filterExperience(e.target.value)}
                    />
                    <span>{exp.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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

          <div className="w-full flex flex-wrap gap-4">
            {data?.map((project, index) => {
              // Check if the user has applied to this project by matching the project ID with applications
              const hasApplied = applications?.some(
                (application) => application.project._id === project._id
              );

              // Create the project data object to pass to ProjectCard
              const newProject = {
                name: project?.company?.name,
                logo: project?.company?.profileUrl,
                hasApplied, // Add the hasApplied flag
                status: hasApplied
                  ? applications.find((app) => app.project._id === project._id)?.status
                  : null, // If applied, get the application status
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

          {isFetching && (
            <div className="py-10">
              <Loading />
            </div>
          )}

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={handleShowMore}
                title="Load More"
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindProjects;
