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
  const [searchQuery, setSearchQuery] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [filterExp, setFilterExp] = useState([]);
  const [expVal, setExpVal] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

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

  // Filter Experience
  const filterExperience = (e) => {
    const selectedExp = e.target.value;
    setExpVal(prevExpVal => {
      return prevExpVal.includes(selectedExp)
        ? prevExpVal.filter(exp => exp !== selectedExp)
        : [...prevExpVal, selectedExp];
    });
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  // Load more projects
  const handleShowMore = (e) => {
    e.preventDefault();
    setPage(prevPage => prevPage + 1);
  };

  // Handle experience range update
  useEffect(() => {
    if (expVal.length > 0) {
      const range = expVal.map(el => el.split("-").map(Number));
      const minExp = Math.min(...range.map(([min]) => min));
      const maxExp = Math.max(...range.map(([, max]) => max));
      setFilterExp(`${minExp}-${maxExp}`);
    }
  }, [expVal]);

  // Fetch projects on initial render or when dependencies change
  useEffect(() => {
    if (user?.semester) {
      fetchProjects();
    }
  }, [sort, filterExp, page, user?.semester]);

  return (
    <div>
      {/* Header Section */}
      <Header
        title={<span className="text-4xl font-bold text-white-700">Find Your Dream Internship with Ease</span>}
        type="home"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={projectLocation}
        setLocation={setProjectLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]">
        {/* Filters Section */}
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm p-5 rounded-lg">
          <p className="text-lg font-semibold text-slate-600 mb-4">Filter by Experience</p>
          <div className="flex flex-col gap-3">
            {experience.map((exp) => (
              <label key={exp.title} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  value={exp?.value}
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

          <div className="w-full flex flex-wrap gap-4">
            {data?.map((project, index) => (
              <ProjectCard
                project={{
                  name: project?.company?.name,
                  logo: project?.company?.profileUrl,
                  application: project?.application || [],
                  ...project,
                }}
                key={index}
                currentUser={user?.user}
              />
            ))}
          </div>

          {/* Show loading spinner */}
          {isFetching && (
            <div className="py-10">
              <Loading />
            </div>
          )}

          {/* Show Load More Button */}
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