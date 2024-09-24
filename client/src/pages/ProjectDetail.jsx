

// import moment from "moment";
// import { useEffect, useState } from "react";
// import { AiOutlineSafetyCertificate } from "react-icons/ai";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { CustomButton, ProjectCard, Loading } from "../components";
// import { apiRequest } from "../utils";

// const noLogo =
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.user);

//   const [project, setProject] = useState(null);
//   const [similarProjects, setSimilarProjects] = useState([]);
//   const [companyProjects, setCompanyProjects] = useState([]);
//   const [selected, setSelected] = useState("0");
//   const [isFetching, setIsFetching] = useState(false);
//   const [hasApplied, setHasApplied] = useState(false);

//   const getProjectDetails = async () => {
//     setIsFetching(true);
//     try {
//       const res = await apiRequest({
//         url: "/projects/get-project-detail/" + id,
//         method: "GET",
//       });

//       setProject(res?.data);
//       setSimilarProjects(res?.similarProjects);
//       setIsFetching(false);

//       // Fetch projects from the same company
//       const companyRes = await apiRequest({
//         url: `/companies/get-company-projects/${res?.data?.company?._id}`,
//         method: "GET",
//         token: user?.token,
//       });
//       console.log("DATA", companyRes?.data);
//       setCompanyProjects(companyRes?.data?.projectPosts);

//       // Check if user has already applied for the project
//       if (res?.data?.application?.includes(user?._id)) {
//         setHasApplied(true);
//       } else {
//         setHasApplied(false);
//       }
//     } catch (error) {
//       setIsFetching(false);
//       console.log(error);
//     }
//   };

//   const handleDeletePost = async () => {
//     setIsFetching(true);
//     try {
//       if (window.confirm("Delete Project Post?")) {
//         const res = await apiRequest({
//           url: "/projects/delete-project/" + project?._id,
//           token: user?.token,
//           method: "DELETE",
//         });

//         if (res?.success) {
//           alert(res?.message);
//           window.location.replace("/");
//         }
//       }
//       setIsFetching(false);
//     } catch (error) {
//       setIsFetching(false);
//       console.log(error);
//     }
//   };

//   const handleApply = async () => {
//     try {
//       const res = await apiRequest({
//         url: "/projects/apply/" + id,
//         token: user?.token,
//         method: "POST",
//       });

//       if (res?.success) {
//         alert(res?.message);
//         setHasApplied(true);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     id && getProjectDetails();
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   }, [id]);

//   return (
//     <div className="container mx-auto">
//       <div className="w-full flex flex-col md:flex-row gap-10">
//         {/* LEFT SIDE */}
//         {isFetching ? (
//           <Loading />
//         ) : (
//           <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
//             <div className="w-full flex items-center justify-between">
//               <div className="w-3/4 flex gap-2">
//                 <img
//                   src={project?.company?.profileUrl || noLogo}
//                   alt={project?.company?.name}
//                   className="w-20 h-20 md:w-24 md:h-20 rounded"
//                 />

//                 <div className="flex flex-col">
//                   <p className="text-xl font-semibold text-gray-600">
//                     {project?.projectTitle}
//                   </p>

//                   <span className="text-base text-blue-600">
//                     {project?.company?.name}
//                   </span>

//                   <span className="text-gray-500 text-sm">
//                     {moment(project?.createdAt).fromNow()}
//                   </span>
//                 </div>
//               </div>

//               <div className="">
//                 <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
//               </div>
//             </div>

//             <div className="w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10">
//               <div className="bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
//                 <span className="text-sm">Salary</span>
//                 <p className="text-lg font-semibold text-gray-700">
//                   $ {project?.salary}
//                 </p>
//               </div>

//               <div className="bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
//                 <span className="text-sm">No. of Applicants</span>
//                 <p className="text-lg font-semibold text-gray-700">
//                   {project?.application?.length}
//                 </p>
//               </div>

//               <div className="bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
//                 <span className="text-sm">No. of Vacancies</span>
//                 <p className="text-lg font-semibold text-gray-700">
//                   {project?.vacancies}
//                 </p>
//               </div>

//               <div className="bg-[#ffcddf] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
//                 <span className="text-sm">Yr. of Experience</span>
//                 <p className="text-lg font-semibold text-gray-700">
//                   {project?.experience}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full flex gap-4 py-5">
//               <CustomButton
//                 onClick={() => setSelected("0")}
//                 title="Project Description"
//                 containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
//                   selected === "0"
//                     ? "bg-black text-white"
//                     : "bg-white text-black border border-gray-300"
//                 }`}
//               />

//               <CustomButton
//                 onClick={() => setSelected("1")}
//                 title="Company / Professor"
//                 containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
//                   selected === "1"
//                     ? "bg-black text-white"
//                     : "bg-white text-black border border-gray-300"
//                 }`}
//               />
//             </div>

//             <div className="my-6">
//               {selected === "0" ? (
//                 <>
//                   <p className="text-xl font-semibold">Project Description</p>
//                   <span className="text-base">{project?.detail[0]?.desc}</span>
//                   {project?.detail[0]?.requirements && (
//                     <>
//                       <p className="text-xl font-semibold mt-8">Requirement</p>
//                       <span className="text-base">
//                         {project?.detail[0]?.requirements}
//                       </span>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="mb-6 flex flex-col">
//                     <p className="text-xl text-blue-600 font-semibold">
//                       {project?.company?.name}
//                     </p>
//                     <span className="text-base">{project?.company?.location}</span>
//                     <span className="text-sm">{project?.company?.email}</span>
//                   </div>
//                   <p className="text-xl font-semibold">About Company</p>
//                   <span>{project?.company?.about}</span>
//                 </>
//               )}
//             </div>

//             <div className="w-full">
//               {user?._id === project?.company?._id ? (
//                 <CustomButton
//                   title="Delete Post"
//                   onClick={handleDeletePost}
//                   containerStyles={`w-full flex items-center justify-center text-white bg-red-700 py-3 px-5 outline-none rounded-full text-base`}
//                 />
//               ) : (
//                 <CustomButton
//                   title={hasApplied ? "Applied" : "Apply Now"}
//                   containerStyles={`w-full flex items-center justify-center text-white py-3 px-5 outline-none rounded-full text-base ${
//                     hasApplied ? "bg-gray-500 cursor-not-allowed" : "bg-black"
//                   }`}
//                   onClick={handleApply}
//                   disabled={hasApplied}
//                 />
//               )}
//             </div>
//           </div>
//         )}

//         {/* RIGHT SIDE */}
//         { user?.accountType === "seeker" ? 
//         <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
//           <p className="text-gray-500 font-semibold">Similar Projects</p>
//           <div className="w-full flex flex-wrap gap-4">
//             {similarProjects?.slice(0, 6).map((project, index) => {
//               const data = {
//                 name: project?.company.name,
//                 logo: project?.company.profileUrl,
//                 ...project,
//               };
//               return <ProjectCard project={data} key={index} />;
//             })}
//           </div>
//         </div>
//         : 
//         <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
//           <p className="text-gray-500 font-semibold">Other projects from { user?.name }</p>
//           <div className="w-full flex flex-wrap gap-4">
//             {companyProjects?.slice(0, 6).map((project, index) => {
//               const data = {
//                 name: project?.company.name,
//                 logo: project?.company.profileUrl,
//                 ...project,
//               };
//               return <ProjectCard project={data} key={index} />;
//             })}
//           </div>
//         </div>
//         }

//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;














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
  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const getProjectDetails = async () => {
    setIsFetching(true);
    try {
      const res = await apiRequest({
        url: "/projects/get-project-detail/" + id,
        method: "GET",
      });

      setProject(res?.data);
      setSimilarProjects(res?.similarProjects.filter(p => p._id !== id));
      setIsFetching(false);

      // Fetch projects from the same company
      const companyRes = await apiRequest({
        url: `/companies/get-company-projects/${res?.data?.company?._id}`,
        method: "GET",
        token: user?.token,
      });
      console.log("DATA", companyRes?.data);
      setCompanyProjects(companyRes?.data?.projectPosts.filter(p => p._id !== id));

      // Check if user has already applied for the project
      if (res?.data?.application?.includes(user?._id)) {
        setHasApplied(true);
      } else {
        setHasApplied(false);
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
    try {
      const res = await apiRequest({
        url: "/projects/apply/" + id,
        token: user?.token,
        method: "POST",
      });

      if (res?.success) {
        alert(res?.message);
        setHasApplied(true);
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
    <div className="container mx-auto">
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

                <div className="flex flex-col">
                  <p className="text-xl font-semibold text-gray-600">
                    {project?.projectTitle}
                  </p>

                  <span className="text-base text-blue-600">
                    {project?.company?.name}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {moment(project?.createdAt).fromNow()}
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

              <div className="bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">No. of Applicants</span>
                <p className="text-lg font-semibold text-gray-700">
                  {project?.application?.length}
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
                    <span className="text-base">{project?.company?.location}</span>
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
                  title={hasApplied ? "Applied" : "Apply Now"}
                  containerStyles={`w-full flex items-center justify-center text-white py-3 px-5 outline-none rounded-full text-base ${
                    hasApplied ? "bg-gray-500 cursor-not-allowed" : "bg-black"
                  }`}
                  onClick={handleApply}
                  disabled={hasApplied}
                />
              )}
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        { user?.accountType === "seeker" ? 
        <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
          <p className="text-gray-500 font-semibold">Similar Projects</p>
          <div className="w-full flex flex-wrap gap-4" style={{ marginTop: '12px' }}>
            {similarProjects?.slice(0, 6).map((project, index) => {
              const data = {
                name: project?.company.name,
                logo: project?.company.profileUrl || noLogo,
                ...project,
              };
              return <ProjectCard project={data} key={index} />;
            })}
          </div>
        </div>
        : 
        <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
          <p className="text-gray-500 font-semibold">Other projects from { user?.name }</p>
          <div className="w-full flex flex-wrap gap-4" style={{ marginTop: '12px' }}>
            {companyProjects?.slice(0, 6).map((project, index) => {
              const data = {
                name: project?.company.name,
                logo: project?.company.profileUrl || noLogo,
                ...project,
              };
              return <ProjectCard project={data} key={index} />;
            })}
          </div>
        </div>
        }

      </div>
    </div>
  );
};

export default ProjectDetail;
