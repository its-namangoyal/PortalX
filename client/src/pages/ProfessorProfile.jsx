import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { FiEdit3, FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomButton, Loading, TextInput } from "../components";
import { Login } from "../redux/userSlice";
import { apiRequest, handleFileUpload } from "../utils";

const CompnayForm = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrMsg(null);

    const uri = profileImage && (await handleFileUpload(profileImage));
    const newData = uri ? { ...data, profileUrl: uri } : data;

    try {
      const res = await apiRequest({
        url: "/companies/update-company",
        token: user?.token,
        data: newData,
        method: "PUT",
      });
      setIsLoading(false);

      if (res.status === "failed") {
        setErrMsg({ ...res });
      } else {
        setErrMsg({ status: "success", message: res.message });
        const newData = { token: res?.token, ...res?.user };
        dispatch(Login(newData));
        localStorage.setItem("userInfo", JSON.stringify(data));

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <Transition appear show={open ?? false} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-white p-8 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-gray-800 mb-4"
                >
                  Edit Company Profile
                </Dialog.Title>

                <form
                  className="w-full flex flex-col gap-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <TextInput
                    name="name"
                    label="Company Name"
                    type="text"
                    register={register("name", {
                      required: "Company Name is required",
                    })}
                    error={errors.name ? errors.name?.message : ""}
                  />

                  {/* Email Field */}
                  <div className="w-full flex flex-col gap-2 mt-1">
                    <TextInput
                      name="email"
                      label="Email"
                      placeholder="e.g., company@example.com"
                      type="email"
                      register={register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      error={errors.email ? errors.email?.message : ""}
                    />
                  </div>

                  <div className="w-full flex gap-4">
                    {/* Contact Field */}
                    <div className="w-1/2 flex flex-col">
                      <TextInput
                        name="contact"
                        label="Contact"
                        placeholder="Phone Number"
                        type="text"
                        register={register("contact", {
                          required: "Contact is required!",
                        })}
                        error={errors.contact ? errors.contact?.message : ""}
                      />
                    </div>

                    {/* Location Field */}
                    <div className="w-1/2 flex flex-col">
                      <TextInput
                        name="location"
                        label="Location/Address"
                        placeholder="e.g., California"
                        type="text"
                        register={register("location", {
                          required: "Location is required",
                        })}
                        error={errors.location ? errors.location?.message : ""}
                      />
                    </div>
                  </div>

                  {/* Full Width Logo Field */}
                  <div className="w-full mt-4 flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">
                      Company Logo
                    </label>
                    <input
                      type="file"
                      className="w-full mt-2 text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">
                      About Company
                    </label>
                    <textarea
                      className="rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                      rows={4}
                      {...register("about", {
                        required: "Write a little bit about your company.",
                      })}
                    ></textarea>
                    {errors.about && (
                      <span
                        role="alert"
                        className="text-xs text-red-500 mt-0.5"
                      >
                        {errors.about?.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <CustomButton
                        type="submit"
                        containerStyles="inline-flex justify-center rounded-lg bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none shadow"
                        title="Save Changes"
                      />
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const CompanyProfile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fetchCompany = async () => {
    setIsLoading(true);
    let id = params?.id || user?._id;

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
      <div className="flex flex-col items-center text-gray-700">
        <img
          src={info?.profileUrl}
          alt="Company Logo"
          className="w-28 h-28 rounded-full mb-4 shadow-lg"
        />
        <h2 className="text-gray-800 text-2xl font-bold">{info?.name}</h2>
        <p className="text-gray-600 text-sm text-center">
          {info?.about || "No Description"}
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 text-gray-600">
          <p className="flex items-center gap-1 text-base">
            <HiLocationMarker className="text-blue-500" />{" "}
            {info?.location || "No Location"}
          </p>
          <p className="flex items-center gap-1 text-base">
            <AiOutlineMail className="text-blue-500" />{" "}
            {info?.email || "No Email"}
          </p>
          <p className="flex items-center gap-1 text-base">
            <FiPhoneCall className="text-blue-500" />{" "}
            {info?.contact || "No Contact"}
          </p>
        </div>

        {info?._id === user?._id && (
          <div className="mt-8">
            <CustomButton
              onClick={() => setOpenForm(true)}
              containerStyles="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
              title="Edit Profile"
            />
          </div>
        )}
      </div>

      <CompnayForm open={openForm} setOpen={setOpenForm} />
    </div>
  );
};

export default CompanyProfile;
