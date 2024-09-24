import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { FiEdit3, FiPhoneCall, FiUpload } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CustomButton, ProjectCard, Loading, TextInput } from "../components";
import { Login } from "../redux/userSlice";
import { apiRequest, handleFileUpload } from "../utils";

const Projects = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fetchCompany = async () => {
    setIsLoading(true);
    let id = null;

    if (params.id && params.id !== undefined) {
      id = params?.id;
    } else {
      id = user?._id;
    }

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
    <div className='container mx-auto p-5'>
      <div className=''>
        <div className='w-full flex flex-col md:flex-row gap-3 justify-between'>
          <h2 className='text-gray-600 text-xl font-semibold'>
            Welcome, {info?.name}
          </h2>

          {/* {user?.user?.accountType === undefined && info?._id === user?._id && (
            <div className='flex items-center justifu-center py-5 md:py-0 gap-4'>
              <CustomButton
                onClick={() => setOpenForm(true)}
                iconRight={<FiEdit3 />}
                containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600  hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
              />

              <Link to='/upload-project'>
                <CustomButton
                  title='Upload Project'
                  iconRight={<FiUpload />}
                  containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none  rounded text-sm md:text-base border border-blue-600`}
                />
              </Link>
            </div>
          )} */}
        </div>

        {/* <div className='w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-sm'>
          <p className='flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full'>
            <HiLocationMarker /> {info?.location ?? "No Location"}
          </p>
          <p className='flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full'>
            <AiOutlineMail /> {info?.email ?? "No Email"}
          </p>
          <p className='flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full'>
            <FiPhoneCall /> {info?.contact ?? "No Contact"}
          </p>

          <div className='flex flex-col items-center mt-10 md:mt-0'>
            <span className='text-xl'>{info?.projectPosts?.length}</span>
            <p className='text-blue-600 '>Project Post</p>
          </div>
        </div> */}
      </div>

      <div className='w-full mt-20 flex flex-col gap-2'>
        <p>Projects Posted</p>

        <div className='flex flex-wrap gap-3'>
          {info?.projectPosts?.map((project, index) => {
            const data = {
              name: info?.name,
              email: info?.email,
              logo: info?.profileUrl,
              ...project,
            };
            return <ProjectCard project={data} key={index} />;
          })}
        </div>
      </div>

      {/* <CompnayForm open={openForm} setOpen={setOpenForm} /> */}
    </div>
  );
};

export default Projects;
