import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomButton, ProjectCard, Loading } from "../components";
import { apiRequest } from "../utils";

const CompanyProfile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [semesters, setSemesters] = useState(["All", "Current"]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const fetchCompany = async () => {
    setIsLoading(true);
    const id = params.id || user?._id;

    try {
      const res = await apiRequest({
        url: `/companies/get-company/${id}`,
        method: "GET",
      });
      setInfo(res?.data);
      setFilteredProjects(res?.data.projectPosts);
    } catch (error) {
      console.error("Error fetching company:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await apiRequest({
        url: "http://localhost:8800/api-v1/semesters",
        method: "GET",
      });

      if (res?.semesters?.length > 0) {
        const fetchedSemesters = res.semesters.map((semester) => semester.name);
        setSemesters(["All", "Current", ...fetchedSemesters]);
      } else {
        console.error("No semesters found in API response.");
      }
    } catch (error) {
      console.error("Error fetching semesters:", error.message);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (info?.projectPosts) {
      const filtered = selectedSemester === "All"
        ? info.projectPosts
        : info.projectPosts.filter(
            (project) =>
              (selectedSemester === "Current" && project.semester === user.semester) ||
              project.semester === selectedSemester
          );
      setFilteredProjects(filtered);
    }
  }, [selectedSemester, info]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-5">
      <div className="w-full mt-3 flex justify-center gap-3">
        {semesters.map((semester) => (
          <button
            key={semester}
            onClick={() => setSelectedSemester(semester)}
            className={`text-blue-600 py-1 px-4 rounded-full border border-blue-600`}
          >
            {semester}
          </button>
        ))}
      </div>
      <div className="w-full mt-20 flex flex-col gap-2">
        <p>Projects Posted</p>
        {filteredProjects?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                project={{
                  ...project,
                  companyName: info?.name,
                  logo: info?.profileUrl,
                  location: info?.location,
                }}
                key={index}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No projects posted yet for the selected semester.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
