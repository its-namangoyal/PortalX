import moment from "moment";
import { GoLocation } from "react-icons/go";
import { Link } from "react-router-dom";
const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/project-detail/${project?._id}`}
      className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 '
    >
      {/* <div
        className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 '
      > */}
      <div className='w-full h-full flex flex-col justify-between'>
        <div className='flex gap-3'>
          <img
            src={project?.logo || noLogo}
            alt={project?.name}
            className='w-14 h-14 '
          />

          <div className='w-full h-16 flex flex-col justify-center'>
            <p className='w-full h-20 flex iteme-center text-lg font-semibold overflow-hidden leading-5'>
              {project?.projectTitle}
            </p>
            {/* <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {project?.location}
            </span> */}
          </div>
        </div>

        <div className='py-3'>
          <p className='text-sm'>
            {project?.detail[0]?.desc?.slice(0, 150) + "..."}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          {/* <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
            {project?.projectType}
          </p> */}
          <span className='text-gray-500 text-sm'>
            {moment(project?.createdAt).fromNow()}
          </span>
        </div>
      </div>
      {/* </div> */}
    </Link>
  );
};

export default ProjectCard;
