import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomButton, ProjectCard, Loading } from "../components";
import { apiRequest } from "../utils";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);

  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [companyProjects, setCompanyProjects] = useState([]);
  const [studentsAccepted, setStudentsAccepted] = useState([]);
  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSemesterMatch, setIsSemesterMatch] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const getProjectDetails = async () => {
    setIsFetching(true);
    try {
      const res = await apiRequest({
        url: "/projects/get-project-detail/" + id,
        method: "GET",
      });

      setProject(res?.data);
      setSimilarProjects(res?.similarProjects.filter((p) => p._id !== id));
      setIsFetching(false);

      setIsSemesterMatch(user?.semester === res?.data?.semester);

      const companyRes = await apiRequest({
        url: `/companies/get-company-projects/${res?.data?.company?._id}`,
        method: "GET",
        token: user?.token,
      });
      setCompanyProjects(
        companyRes?.data?.projectPosts.filter((p) => p._id !== id)
      );

      const applicationRes = await apiRequest({
        url: `/applications/check/${id}?userId=${user?._id}`,
        method: "GET",
        token: user?.token,
      });
      setHasApplied(applicationRes?.exists || false);
      setApplicationStatus(applicationRes?.status || null);

      // Fetch applications for the project if the account type is not 'seeker'
      if (user?.accountType !== "seeker") {
        const applicationsRes = await apiRequest({
          url: `/applications/get-applications-by-project/${id}`,
          method: "GET",
          token: user?.token,
        });

        // Filter accepted students
        setStudentsAccepted(
          applicationsRes?.data?.filter((app) => app.status === "accepted")
        );
      }
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setIsFetching(true);
    try {
      if (window.confirm("Delete Project Post?")) {
        const res = await apiRequest({
          url: "/projects/delete-project/" + project?._id,
          token: user?.token,
          method: "DELETE",
        });

        if (res?.success) {
          alert(res?.message);
          window.location.replace("/");
        }
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const handleApply = async () => {
    if (!isSemesterMatch || hasApplied) {
      return;
    }

    try {
      const res = await apiRequest({
        url: "/projects/apply/" + id,
        token: user?.token,
        method: "POST",
      });

      if (res?.success) {
        alert(res?.message);
        setHasApplied(true);
        setApplicationStatus(res?.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && getProjectDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  return (
    <div className="container mx-auto mt-10">
      <div className="w-full flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE */}
        {isFetching ? (
          <Loading />
        ) : (
          <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
            <div className="w-full flex items-center justify-between">
              <div className="w-3/4 flex gap-2">
                <img
                  src={project?.company?.profileUrl || noLogo}
                  alt={project?.company?.name}
                  className="w-20 h-20 md:w-24 md:h-20 rounded"
                />

                <div className="flex flex-col mx-2">
                  <p className="text-xl font-semibold text-gray-600">
                    {project?.projectTitle}
                  </p>

                  <span className="text-base text-blue-600">
                    {project?.company?.name}
                  </span>

                  <span className="text-sm text-gray-500 mt-1">
                    Semester: {project?.semester}
                  </span>
                </div>
              </div>

              <div className="">
                <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
              </div>
            </div>

            <div className="w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10">
              <div className="bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">Salary</span>
                <p className="text-lg font-semibold text-gray-700">
                  $ {project?.salary}
                </p>
              </div>

              <div className="bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">No. of Vacancies</span>
                <p className="text-lg font-semibold text-gray-700">
                  {project?.vacancies}
                </p>
              </div>

              <div className="bg-[#ffcddf] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">Yr. of Experience</span>
                <p className="text-lg font-semibold text-gray-700">
                  {project?.experience}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-4 py-5">
              <CustomButton
                onClick={() => setSelected("0")}
                title="Project Description"
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                  selected === "0"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300"
                }`}
              />

              <CustomButton
                onClick={() => setSelected("1")}
                title="Company / Professor"
                containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                  selected === "1"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300"
                }`}
              />
            </div>

            <div className="my-6">
              {selected === "0" ? (
                <>
                  <p className="text-xl font-semibold">Project Description</p>
                  <span className="text-base">{project?.detail[0]?.desc}</span>
                  {project?.detail[0]?.requirements && (
                    <>
                      <p className="text-xl font-semibold mt-8">Requirement</p>
                      <span className="text-base">
                        {project?.detail[0]?.requirements}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6 flex flex-col">
                    <p className="text-xl text-blue-600 font-semibold">
                      {project?.company?.name}
                    </p>
                    <span className="text-base">
                      {project?.company?.location}
                    </span>
                    <span className="text-sm">{project?.company?.email}</span>
                  </div>
                  <p className="text-xl font-semibold">About Company</p>
                  <span>{project?.company?.about}</span>
                </>
              )}
            </div>

            <div className="w-full">
              {user?._id === project?.company?._id ? (
                <CustomButton
                  title="Delete Post"
                  onClick={handleDeletePost}
                  containerStyles={`w-full flex items-center justify-center text-white bg-red-700 py-3 px-5 outline-none rounded-full text-base`}
                />
              ) : (
                <CustomButton
                  title={
                    hasApplied
                      ? applicationStatus === "accepted"
                        ? "Application Accepted"
                        : "Application Pending"
                      : !isSemesterMatch
                      ? "Semester Mismatch"
                      : "Apply Now"
                  }
                  onClick={handleApply}
                  containerStyles={`w-full flex items-center justify-center ${
                    hasApplied
                      ? applicationStatus === "accepted"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                      : !isSemesterMatch
                      ? "bg-gray-400 text-white"
                      : "bg-black text-white"
                  } py-3 px-5 outline-none rounded-full text-base`}
                />
              )}
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/3 2xl:w-1/3 bg-white px-5 py-10 md:px-10 shadow-md">
          {/* For Seekers: Show Similar Projects */}
          {user?.accountType === "seeker" && (
            <>
              <p className="text-lg font-semibold">Similar Projects</p>
              <div className="w-full mt-5 flex flex-col gap-3">
                {similarProjects?.map((project) => (
                  <ProjectCard
                    key={project?._id}
                    project={{
                      ...project,
                      logo: project?.company?.profileUrl,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* For Companies and Others: Show Accepted Students */}
          {user?.accountType !== "seeker" && (
            <>
              <p className="text-2xl font-bold text-gray-800">
                Students Enrolled
              </p>
              <div className="w-full mt-6 flex flex-col gap-6">
                {studentsAccepted?.map((application) => (
                  <div
                    key={application?._id}
                    className="w-full bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-5">
                      {/* Profile Picture */}
                      {application?.student?.profileUrl && (
                        <img
                          src={application?.student?.profileUrl}
                          alt={`${application?.student?.firstName} ${application?.student?.lastName}`}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                        />
                      )}
                      <div>
                        <p className="text-xl font-semibold text-gray-900">
                          {application?.student?.firstName}{" "}
                          {application?.student?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application?.student?.email}
                        </p>
                        <span className="text-sm text-gray-500">
                          Applied on{" "}
                          {moment(application?.appliedDate).format(
                            "MMM Do YYYY"
                          )}
                        </span>
                        {/* CV/Resume */}
                        {application?.student?.cvUrl && (
                          <div className="mt-4">
                            <a
                              href={application?.student?.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 font-medium text-sm hover:underline"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
