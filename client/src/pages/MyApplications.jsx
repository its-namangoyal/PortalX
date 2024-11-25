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
        url: "/applications/user/" + id,
        method: "GET",
      });

      if (res.success) {
        setApplications(res?.data || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      setApplications([]);
    } finally {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 text-2xl font-semibold">
          My Applications
        </h2>
      </div>

      <div className="mt-6">
        <p className="text-gray-600 mb-4">
          Showing: {applications.length} Application(s)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {applications.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              No applications found
            </p>
          ) : (
            applications.map((application, index) => {
              const data = {
                ...application.project,
                logo: application?.project?.company?.profileUrl,
                status: application.status,
                location: application?.project?.company?.location,
                hasApplied: true, // Add this flag to indicate the user has already applied
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
