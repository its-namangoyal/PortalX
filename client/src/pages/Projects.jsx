import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ProjectCard, Loading } from "../components";
import { apiRequest } from "../utils";

const Projects = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("All");

  const fetchCompany = async () => {
    setIsLoading(true);
    let id = params?.id || user?._id;

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjectsBySemester = (projects, semester) => {
    if (semester === "All") return projects;
    if (semester === "Current") return projects.filter((proj) => proj.semester === user?.semester);
    return projects.filter((proj) => proj.semester === semester);
  };

  useEffect(() => {
    fetchCompany();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-5">
      <div className="w-full flex flex-col md:flex-row gap-3 justify-between">
        <h2 className="text-gray-600 text-xl font-semibold">
          Welcome, {info?.name}
        </h2>
      </div>

      <div className="flex gap-4 mt-5">
        {["All", "Current", "Fall 2024", "Summer 2024", "Winter 2024"].map((semester) => (
          <button
            key={semester}
            className={`px-4 py-2 rounded-md ${
              selectedSemester === semester ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedSemester(semester)}
          >
            {semester}
          </button>
        ))}
      </div>

      <div className="w-full mt-10 flex flex-col gap-2">
        <p>Projects Posted</p>

        {info?.projectPosts?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filterProjectsBySemester(info.projectPosts, selectedSemester).map((project, index) => {
              const data = {
                companyName: info?.name, 
                email: info?.email,
                logo: info?.profileUrl,
                location: info?.location,
                ...project,
              };
              return <ProjectCard project={data} key={index} />;
            })}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No projects posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
