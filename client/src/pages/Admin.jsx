import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
  const [studentFile, setStudentFile] = useState(null);
  const [companyFile, setCompanyFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
  };

  const handleCompanyFileChange = (e) => {
    setCompanyFile(e.target.files[0]);
  };

  const handleStudentUpload = async (e) => {
    e.preventDefault();
    if (!studentFile) {
      setMessage("Please select a student file.");
      return;
    }

    const formData = new FormData();
    formData.append("studentFile", studentFile);

    try {
      const response = await axios.post("http://localhost:8800/admin/upload/student", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "Student file uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading student file.");
    }
  };

  const handleCompanyUpload = async (e) => {
    e.preventDefault();
    if (!companyFile) {
      setMessage("Please select a company/professor file.");
      return;
    }

    const formData = new FormData();
    formData.append("companyFile", companyFile);

    try {
      const response = await axios.post("http://localhost:8800/admin/upload/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "Company/Professor file uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading company/professor file.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="flex flex-row space-x-10">
        {/* Upload Student Data */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel: Upload Student Data</h2>
          <form onSubmit={handleStudentUpload} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <div className="mb-4">
              <input
                type="file"
                onChange={handleStudentFileChange}
                className="block w-full text-sm text-gray-600 
                           file:mr-4 file:py-2 file:px-4 
                           file:rounded-lg file:border-0 
                           file:text-sm file:font-semibold 
                           file:bg-blue-50 file:text-blue-700 
                           hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold py-2 px-4 
                         rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-300 
                         focus:ring-offset-2 transition duration-200"
            >
              Upload Student Data
            </button>
          </form>
        </div>

        {/* Upload Company/Professor Data */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel: Upload Company/Professor Data</h2>
          <form onSubmit={handleCompanyUpload} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <div className="mb-4">
              <input
                type="file"
                onChange={handleCompanyFileChange}
                className="block w-full text-sm text-gray-600 
                           file:mr-4 file:py-2 file:px-4 
                           file:rounded-lg file:border-0 
                           file:text-sm file:font-semibold 
                           file:bg-blue-50 file:text-blue-700 
                           hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold py-2 px-4 
                         rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-300 
                         focus:ring-offset-2 transition duration-200"
            >
              Upload Company/Professor Data
            </button>
          </form>
        </div>
      </div>

      {message && (
        <p className={`mt-6 text-center font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Admin;
