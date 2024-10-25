import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CustomButton, ProjectCard, Loading } from "../components";
import { apiRequest } from "../utils";

const CompanyProfile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("All");

  const fetchCompany = async () => {
    setIsLoading(true);
    const id = params.id || user?._id;

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
      setFilteredProjects(res?.data.projectPosts);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Filter projects by selected semester
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

  useEffect(() => {
    fetchCompany();
  }, []);

  const semesterOptions = ["All", "Current", "Fall 2024", "Summer 2024", "Winter 2024"];

  if (isLoading) return <Loading />;

  return (
    <div className='container mx-auto p-5'>
      <div className='w-full mt-10 flex gap-3'>
        {semesterOptions.map((semester) => (
          <button
            key={semester}
            onClick={() => setSelectedSemester(semester)}
            className={`py-2 px-4 rounded ${
              selectedSemester === semester ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {semester}
          </button>
        ))}
      </div>

      <div className='w-full mt-20 flex flex-col gap-2'>
        <p>Projects Posted</p>
        {filteredProjects?.length > 0 ? (
          <div className='flex flex-wrap gap-3'>
            {filteredProjects.map((project, index) => (
              <ProjectCard project={{ ...project, companyName: info?.name, logo: info?.profileUrl, location: info?.location, }} key={index} />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 italic'>No projects posted yet for the selected semester.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
