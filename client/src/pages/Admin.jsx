import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { 
  FaUsers, 
  FaBuilding, 
  FaProjectDiagram, 
  FaUpload,
  FaChartLine,
  FaGraduationCap,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCalendarAlt,
  FaPlus
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentFile, setStudentFile] = useState(null);
  const [companyFile, setCompanyFile] = useState(null);
  const [newSemester, setNewSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalProjects: 0,
    studentsBySemester: [],
    projectsBySemester: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentFileChange = (e) => setStudentFile(e.target.files[0]);
  const handleCompanyFileChange = (e) => setCompanyFile(e.target.files[0]);

  const handleStudentUpload = async (e) => {
    e.preventDefault();
    if (!studentFile) {
      toast.error("Please select a student file.");
      return;
    }

    const formData = new FormData();
    formData.append("studentFile", studentFile);

    try {
      const response = await axios.post(
        "http://localhost:8800/admin/upload/student",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Student file uploaded successfully!");
      fetchStats();
    } catch (error) {
      toast.error("Error uploading student file.");
    }
  };

  const handleCompanyUpload = async (e) => {
    e.preventDefault();
    if (!companyFile) {
      toast.error("Please select a company file.");
      return;
    }

    const formData = new FormData();
    formData.append("companyFile", companyFile);

    try {
      const response = await axios.post(
        "http://localhost:8800/admin/upload/company",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Company file uploaded successfully!");
      fetchStats();
    } catch (error) {
      toast.error("Error uploading company file.");
    }
  };

  const handleAddSemester = async () => {
    if (!newSemester.trim()) {
      toast.error("Semester name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/admin/semesters", {
        name: newSemester
      });

      if (response.data.success) {
        toast.success("Semester added successfully!");
        setNewSemester("");
        fetchStats();
      } else {
        toast.error("Failed to add semester.");
      }
    } catch (error) {
      toast.error("Error adding semester.");
    }
  };

  // Chart configurations
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Student Enrollment Trends',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Students' }
      },
      x: {
        title: { display: true, text: 'Semester' }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Projects per Semester',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Projects' }
      },
      x: {
        title: { display: true, text: 'Semester' }
      }
    }
  };

  const lineChartData = {
    labels: stats.studentsBySemester.map(sem => sem._id),
    datasets: [{
      label: 'Students',
      data: stats.studentsBySemester.map(sem => sem.count),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.3,
    }]
  };

  const barChartData = {
    labels: stats.projectsBySemester.map(sem => sem.semester),
    datasets: [{
      label: 'Projects',
      data: stats.projectsBySemester.map(sem => sem.projectCount),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
      ],
      borderWidth: 1,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ToastContainer />
      
      {/* Sidebar */}
      {/* <div className="w-64 bg-gray-900 min-h-screen flex flex-col">
        <div className="p-4">
          <h2 className="text-white text-2xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  activeTab === 'dashboard' ? 'bg-gray-800 text-white' : ''
                }`}
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-md">
          <div className="mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
         
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    <CountUp end={stats.totalStudents} duration={2} />
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Companies</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    <CountUp end={stats.totalCompanies} duration={2} />
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaBuilding className="text-2xl text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Projects</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    <CountUp end={stats.totalProjects} duration={2} />
                  </h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaProjectDiagram className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Enrollment Trends</h2>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Line options={lineChartOptions} data={lineChartData} />
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Projects per Semester</h2>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Bar options={barChartOptions} data={barChartData} />
                )}
              </div>
            </div>
          </div>

          {/* Upload and Add Semester Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Student Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Student Data</h2>
              <form onSubmit={handleStudentUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleStudentFileChange}
                    className="hidden"
                    id="studentFile"
                  />
                  <label
                    htmlFor="studentFile"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <FaUpload className="text-3xl text-gray-400" />
                    <span className="text-gray-600">Click to upload student file</span>
                    <span className="text-sm text-gray-500">
                      {studentFile ? studentFile.name : "No file selected"}
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Upload Student Data
                </button>
              </form>
            </div>

            {/* Company Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Company Data</h2>
              <form onSubmit={handleCompanyUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleCompanyFileChange}
                    className="hidden"
                    id="companyFile"
                  />
                  <label
                    htmlFor="companyFile"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <FaUpload className="text-3xl text-gray-400" />
                    <span className="text-gray-600">Click to upload company file</span>
                    <span className="text-sm text-gray-500">
                      {companyFile ? companyFile.name : "No file selected"}
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Upload Company Data
                </button>
              </form>
            </div>
          </div>

          {/* Add Semester Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              Add New Semester
            </h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
                placeholder="Enter Semester Name (e.g., Fall 2024)"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <button
                onClick={handleAddSemester}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Semester
              </button>
            </div>
            
            {/* Display current semesters */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Current Semesters</h3>
              <div className="flex flex-wrap gap-2">
                {stats.studentsBySemester.map((sem, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {sem._id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;