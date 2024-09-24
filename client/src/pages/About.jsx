import React from "react";
import { JobImg } from "../assets";

const About = () => {
  return (
    <div className='container mx-auto flex flex-col gap-8 2xl:gap-14 py-6 '>
      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center p-5'>
        <div className='w-full md:2/3 2xl:w-2/4'>
          <h1 className='text-3xl text-blue-600 font-bold mb-5'>About Us</h1>
          <p className='text-justify leading-7'>
          PortalX is a portal designed to connect students with internship projects offered by
          companies and professors from universities. It provides a streamlined platform where
          students can find and apply for internship projects that match their skills and interests. For
          companies and professors, PortalX offers a convenient way to upload their projects and
          find suitable students with the required skills.
          </p>
        </div>
        <img src={JobImg} alt='About' className='w-auto h-[300px]' />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
        PortalX aims to simplify and enhance the process of matching students with relevant
        internship opportunities. By creating detailed profiles, both students and project providers
        can eficiently manage applications and selections. This platform will facilitate better
        connections and collaboration between academia and industry, supporting students'
        career development and helping companies and professors find qualified interns.
        Overall, PortalX seeks to bridge the gap between education and professional experience,
        making the internship project process more accessible and eficient for all parties involved.
        </p>
      </div>
    </div>
  );
};

export default About;
