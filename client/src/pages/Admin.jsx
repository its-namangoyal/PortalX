import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [studentFile, setStudentFile] = useState(null);
  const [companyFile, setCompanyFile] = useState(null);
  const [newSemester, setNewSemester] = useState(""); // State to store new semester input

  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
  };

  const handleCompanyFileChange = (e) => {
    setCompanyFile(e.target.files[0]);
  };

  const handleStudentUpload = async (e) => {
    e.preventDefault();
    if (!studentFile) {
      toast.error("Please select a student file.");
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

      toast.success(response.data.message || "Student file uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading student file.");
    }
  };

  const handleCompanyUpload = async (e) => {
    e.preventDefault();
    if (!companyFile) {
      toast.error("Please select a company/professor file.");
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

      toast.success(response.data.message || "Company/Professor file uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading company/professor file.");
    }
  };

  const handleAddSemester = async () => {
    if (!newSemester.trim()) {
      toast.error("Semester name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/admin/semesters", { name: newSemester });

      if (response.data.success) {
        toast.success("Semester added successfully!");
        setNewSemester(""); // Clear the input field
      } else {
        toast.error("Failed to add semester.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding semester.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <ToastContainer /> {/* To display toaster notifications */}

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

      {/* Add New Semester */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel: Add New Semester</h2>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={newSemester}
            onChange={(e) => setNewSemester(e.target.value)}
            placeholder="Enter Semester Name (e.g., Fall 2025)"
            className="p-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleAddSemester}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transition duration-200"
          >
            Add Semester
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
