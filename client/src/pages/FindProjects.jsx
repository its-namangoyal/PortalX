import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CustomButton, ProjectCard, ListBox, Loading } from "../components";
import Header from "../components/Header";
import { apiRequest, updateURL } from "../utils";

const FindProjects = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [filterExp, setFilterExp] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [semesters, setSemesters] = useState([]); // State to store fetched semesters

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Fetch available semesters
  const fetchSemesters = async () => {
    try {
      const response = await apiRequest({
        url: "http://localhost:8800/api-v1/semesters",
        method: "GET",
      });
      setSemesters(response?.semesters || []);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

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
    });

    try {
      const projectsRes = await apiRequest({
        url: "/projects" + newURL,
        method: "GET",
      });

      const appsRes = await apiRequest({
        url: `/applications/user/${user?._id}`,
        method: "GET",
      });

      let filteredProjects = projectsRes.data;

      // Apply semester filter
      if (semesterFilter === "Current") {
        filteredProjects = filteredProjects.filter(
          (project) => project.semester === user.semester
        );
      } else if (semesterFilter !== "All") {
        filteredProjects = filteredProjects.filter(
          (project) => project.semester === semesterFilter
        );
      }

      // Apply experience filter (if any)
      if (filterExp.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filterExp.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return project.experience >= min && project.experience <= max;
          })
        );
      }

      setNumPage(projectsRes?.numOfPage || 1);
      setRecordCount(filteredProjects.length);
      setData(filteredProjects);
      setApplications(appsRes?.data || []);
    } catch (error) {
      console.error("Error fetching projects or applications:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSemesters(); // Fetch semesters on component mount
    if (user?.semester) {
      fetchProjectsAndApplications();
    }
  }, [sort, filterExp, page, user?.semester, semesterFilter]);

  return (
    <div>
      <Header
        title="Find Your Dream Internship with Ease"
        type="home"
        handleClick={fetchProjectsAndApplications}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={projectLocation}
        setLocation={setProjectLocation}
      />

      {/* Semester Filter Buttons (Moved Above Projects Section) */}
      <div className="w-full flex justify-center gap-3 mb-6">
        <CustomButton
          onClick={() => setSemesterFilter("All")}
          title="All"
          containerStyles="text-blue-600 py-1 px-4 rounded-full border border-blue-600"
        />
        <CustomButton
          onClick={() => setSemesterFilter("Current")}
          title="Current"
          containerStyles="text-blue-600 py-1 px-4 rounded-full border border-blue-600"
        />
        {semesters.map((semester) => (
          <CustomButton
            key={semester._id}
            onClick={() => setSemesterFilter(semester.name)}
            title={semester.name}
            containerStyles="text-blue-600 py-1 px-4 rounded-full border border-blue-600"
          />
        ))}
      </div>

      <div className="container mx-auto flex justify-center px-6 bg-[#f7fdfd]">
        {/* Projects Section */}
        <div className="w-full px-5 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm md:text-base">
              Showing: <span className="font-semibold">{recordCount}</span>{" "}
              Internships Available
            </p>
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
              <p className="text-sm md:text-base">Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

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
                  ? applications.find((app) => app.project._id === project._id)
                      ?.status
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

          {isFetching && (
            <div className="py-10">
              <Loading />
            </div>
          )}

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={() => setPage((prevPage) => prevPage + 1)}
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
