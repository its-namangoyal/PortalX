import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomButton, Loading, TextInput } from "../components";
import { apiRequest } from "../utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const UploadProject = () => {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [semesters, setSemesters] = useState([]); // State for semesters

  const onSubmit = async (data) => {
    if (!user?.about || !user?.contact || !user?.location) {
      toast.error("Company profile not set. Please set Company profile first.");
      return;
    }

    setIsLoading(true);

    const newData = { ...data, projectType: "Full-Time" }; // Example project type
    try {
      const res = await apiRequest({
        url: "/projects/upload-project",
        token: user?.token,
        data: newData,
        method: "POST",
      });

      if (res.status === "failed") {
        toast.error(res.message);
      } else {
        toast.success("Project uploaded successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the semesters on component mount
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await apiRequest({
          url: "/semesters", // Make API call to fetch semesters
          method: "GET",
        });

        if (res?.success) {
          setSemesters(res.semesters); // Set the fetched semesters
        } else {
          toast.error("Failed to fetch semesters.");
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        toast.error("Error fetching semesters. Please try again.");
      }
    };

    fetchSemesters();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="container mx-auto px-5 py-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Post a Project</h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="projectTitle"
            label="Project Title"
            placeholder="e.g., PortalX"
            type="text"
            required={true}
            register={register("projectTitle", {
              required: "Project Title is required",
            })}
            error={errors.projectTitle ? errors.projectTitle?.message : ""}
          />

          <div className="w-full">
            <label className="text-gray-600 text-sm mb-1">Semester</label>
            <select
              {...register("semester", {
                required: "Semester is required",
              })}
              className="w-full rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-3 py-2"
            >
              <option value="">Select Semester</option>
              {semesters.length > 0 ? (
                semesters.map((semester) => (
                  <option key={semester._id} value={semester.name}>
                    {semester.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
            {errors.semester && (
              <span className="text-red-500 text-sm mt-1">{errors.semester.message}</span>
            )}
          </div>

          <div className="w-full flex gap-4">
            <div className="w-1/2">
              <TextInput
                name="salary"
                label="Salary (CAD)"
                placeholder="e.g., 1500"
                type="number"
                register={register("salary", {
                  required: "Salary is required",
                })}
                error={errors.salary ? errors.salary?.message : ""}
              />
            </div>
          </div>

          <div className="w-full flex gap-4">
            <div className="w-1/2">
              <TextInput
                name="vacancies"
                label="No. of Vacancies"
                placeholder="e.g., 2"
                type="number"
                register={register("vacancies", {
                  required: "Vacancies are required!",
                })}
                error={errors.vacancies ? errors.vacancies?.message : ""}
              />
            </div>

            <div className="w-1/2">
              <TextInput
                name="experience"
                label="Years of Experience"
                placeholder="e.g., 1"
                type="number"
                register={register("experience", {
                  required: "Experience is required",
                })}
                error={errors.experience ? errors.experience?.message : ""}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Project Description</label>
            <textarea
              className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
              rows={4}
              {...register("desc", {
                required: "Project Description is required!",
              })}
            ></textarea>
            {errors.desc && (
              <span className="text-xs text-red-500 mt-0.5">{errors.desc?.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Requirements</label>
            <textarea
              className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
              rows={4}
              {...register("requirements")}
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            {isLoading ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none"
                title="Submit"
              />
            )}
          </div>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default UploadProject;
