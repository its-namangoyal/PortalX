import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CustomButton, ProjectCard, Loading } from "../components";
import { apiRequest } from "../utils";

const MyApplications = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    const id = params.id || user?._id;

    try {
      const res = await apiRequest({
        url: "/projects/applications/" + id,
        method: "GET",
      });

      // Assuming `res.data` contains an array of applied projects
      setApplications(res?.applications || []);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params.id, user?._id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='container mx-auto p-5'>
      <div className='w-full flex flex-col md:flex-row gap-3 justify-between'>
        <h2 className='text-gray-600 text-xl font-semibold'>
          My Applications
        </h2>
      </div>

      <div className='w-full mt-20 flex flex-col gap-2'>
        <p>Showing: {applications.length} Applied Projects</p>

        <div className='flex flex-wrap gap-3'>
          {applications.length === 0 ? (
            <p>No applications found</p>
          ) : (
            applications.map((project, index) => {
              const data = {
                name: project?.company?.name,
                email: project?.company?.email,
                logo: project?.company?.profileUrl,
                ...project,
              };
              return <ProjectCard project={data} key={index} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
