import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import { footerLinks } from "../utils/data";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";

const Footer = () => {
  return (
    <footer className='text-white'>
      {/* Decorative Wave */}
      <div className='overflow-x-hidden'>
        <svg
          preserveAspectRatio='none'
          viewBox='0 0 1200 120'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full h-[100px] rotate-180 fill-current text-blue-700'
        >
          <path d='M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z' />
        </svg>
      </div>

      {/* Main Footer Section */}
      <div className='bg-blue-700'>
        <div className='container px-5 py-16 mx-auto'>
          {/* Links Section */}
          <div className='flex flex-wrap justify-between gap-10'>
            {footerLinks.map(({ id, title, links }) => (
              <div className='w-auto' key={id}>
                <h2 className='font-semibold text-lg mb-4'>{title}</h2>
                <ul className='space-y-3'>
                  {links.map((link, index) => (
                    <li key={link + index}>
                      <Link
                        to='/'
                        className='text-gray-300 hover:text-white text-base transition-colors duration-200'
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription and Socials */}
        <div className='bg-blue-800 py-10'>
          <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
            <div className='w-full md:w-1/2 lg:w-1/3'>
              <p className='text-white text-lg mb-4'>Subscribe to our Newsletter</p>
              <div className='flex items-center'>
                <TextInput
                  styles='flex-grow bg-gray-100 px-4 py-2 rounded-l-lg'
                  type='email'
                  placeholder='Email Address'
                />
                <CustomButton
                  title='Subscribe'
                  containerStyles='bg-blue-900 text-white px-6 py-2.5 rounded-r-lg hover:bg-blue-600 transition-all'
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className='mt-8 md:mt-0 flex space-x-5'>
              <a
                href='/'
                className='text-white text-2xl hover:scale-125 transition-transform ease-in-out duration-300'
              >
                <FaFacebookF />
              </a>
              <a
                href='/'
                className='text-white text-2xl hover:scale-125 transition-transform ease-in-out duration-300'
              >
                <FaTwitter />
              </a>
              <a
                href='/'
                className='text-white text-2xl hover:scale-125 transition-transform ease-in-out duration-300'
              >
                <FiInstagram />
              </a>
              <a
                href='/'
                className='text-white text-2xl hover:scale-125 transition-transform ease-in-out duration-300'
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className='bg-blue-900'>
          <div className='container mx-auto py-6 flex flex-col sm:flex-row items-center justify-between'>
            <p className='text-gray-400 text-sm text-center sm:text-left'>
              &copy; 2024 PortalX. All Rights Reserved.
            </p>
            <p className='text-gray-400 text-sm mt-4 sm:mt-0 text-center'>
              Designed and Developed by University of Windsor
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;