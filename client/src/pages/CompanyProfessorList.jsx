import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleDocumentUpload } from "../utils"; // Import the function for document upload

const CompanyProfessorList = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    about: "",
    profileUrl: "",
    semester: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    action: null,
  });
  const [filter, setFilter] = useState("All");
  const [semesters, setSemesters] = useState([]); // State for semesters
  const [ethicalDoc, setEthicalDoc] = useState(null); // State for the ethical document
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    fetchSemesters();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api-v1/professors"
      );
      setCompanies(response.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      showMessage("error", "Failed to load companies.");
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company._id);
    setFormData({
      name: company.name,
      email: company.email,
      contact: company.contact,
      location: company.location,
      about: company.about,
      profileUrl: company.profileUrl,
      semester: company.semester,
    });
  };

  const handleDelete = async (id) => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.delete(`http://localhost:8800/api-v1/professors/${id}`);
          showMessage("success", "Company deleted successfully!");
          fetchCompanies();
        } catch (err) {
          console.error("Error deleting company:", err);
          showMessage("error", "Failed to delete company.");
        }
      },
    });
  };

  const handleUpdate = () => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.put(
            `http://localhost:8800/api-v1/professors/${editingCompany}`,
            formData
          );
          setEditingCompany(null);
          showMessage("success", "Company updated successfully!");
          fetchCompanies();
        } catch (err) {
          console.error("Error updating company:", err);
          showMessage("error", "Failed to update company.");
        }
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 10000);
  };

  const handleConfirm = async () => {
    if (confirmPopup.action) await confirmPopup.action();
    setConfirmPopup({ visible: false, action: null });
  };

  const getFilteredCompanies = () => {
    if (filter === "All") return companies;
    return companies.filter((company) => company.semester === filter);
  };

  const handleViewNotes = (id) => {
    navigate(`/professor-notes/${id}`);
  };

  // Handle change of the ethical document
  const handleEthicalDocChange = (e) => {
    setEthicalDoc(e.target.files[0]);
  };

  // Upload ethical document
  const uploadEthicalDocument = async (companyId) => {
    if (!ethicalDoc) {
      showMessage("error", "Please select a document to upload.");
      return;
    }

    try {
      const ethicalDocUrl = await handleDocumentUpload(ethicalDoc);

      // Update the company with the document URL
      await axios.put(`http://localhost:8800/api-v1/professors/${companyId}`, {
        documentUrl: ethicalDocUrl,
      });

      showMessage("success", "Ethical document uploaded successfully!");
      fetchCompanies(); // Refetch companies to reflect the uploaded document
    } catch (error) {
      console.error("Error uploading ethical document:", error);
      showMessage("error", "Failed to upload ethical document.");
    }
  };

  // Function to delete the ethical document
  const deleteEthicalDocument = async (companyId) => {
    try {
      await axios.put(`http://localhost:8800/api-v1/professors/${companyId}`, {
        documentUrl: "", // Set the documentUrl to an empty string to delete it
      });
      showMessage("success", "Ethical document deleted successfully!");
      fetchCompanies(); // Refetch companies to reflect the change
    } catch (error) {
      console.error("Error deleting ethical document:", error);
      showMessage("error", "Failed to delete ethical document.");
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api-v1/semesters");
      setSemesters(response.data.semesters);
    } catch (err) {
      console.error("Error fetching semesters:", err);
      showMessage("error", "Failed to load semesters.");
    }
  };

  const filteredCompanies = getFilteredCompanies();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {message.text && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-md transition-transform transform ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {confirmPopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h2 className="text-xl font-bold">Are you sure?</h2>
            <p>This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button onClick={handleConfirm} className="btn btn-primary">
                Yes
              </button>
              <button
                onClick={() =>
                  setConfirmPopup({ visible: false, action: null })
                }
                className="btn btn-secondary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter buttons section */}
      <div className="flex justify-center gap-4 mt-5 mb-5">
        <button
          className={`py-1 px-4 rounded-full border border-blue-600 ${
            filter === "All"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600"
          }`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        {semesters.map((semester) => (
          <button
            key={semester._id}
            className={`py-1 px-4 rounded-full border border-blue-600 ${
              filter === semester.name
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600"
            }`}
            onClick={() => setFilter(semester.name)}
          >
            {semester.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white shadow-md p-6 rounded-md flex items-center justify-between"
            >
              {editingCompany === company._id ? (
                <div className="flex flex-col space-y-4 w-full">
                  <label className="font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <label className="font-semibold">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <label className="font-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <label className="font-semibold">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <label className="font-semibold">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="input-field"
                  />

                  <div className="flex space-x-4">
                    <button onClick={handleUpdate} className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingCompany(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full items-center">
                  <div className="text-lg font-medium">
                    <img
                      src={company.profileUrl}
                      alt={`${company.name} Logo`}
                      className="w-16 h-16 rounded-full mb-4"
                    />
                    <p className="my-2">
                      <strong>Name:</strong> {company.name}
                    </p>
                    <p className="my-2">
                      <strong>Email:</strong> {company.email}
                    </p>
                    <p className="my-2">
                      <strong>Contact:</strong> {company.contact}
                    </p>
                    <p className="my-2">
                      <strong>Location:</strong> {company.location}
                    </p>
                    <p className="w-25">
                      <strong>About:</strong> {company.about}
                    </p>
                    <p className="my-2">
                      <strong>Semester:</strong> {company.semester}
                    </p>
                    <div className="space-x-4 my-3">
                    <button
                      onClick={() => handleEdit(company)}
                      className="btn btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewNotes(company._id)}
                      className="btn btn-secondary"
                    >
                      Notes
                    </button>
                  </div>
                    <div className="my-2">
                      <input
                        type="file"
                        onChange={handleEthicalDocChange}
                        className="file-input"
                      />
                      <button
                        onClick={() => uploadEthicalDocument(company._id)}
                        className="btn btn-primary"
                      >
                        Upload Ethical Document
                      </button>
                    </div>
                    {/* Display link to view the ethical document */}
                    {company.documentUrl && (
                      <>
                        <a
                          href={company.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          View Ethical Document
                        </a>

                        {/* Button to delete the ethical document */}
                        <button
                          onClick={() => deleteEthicalDocument(company._id)}
                          className="inline-block mt-2 ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Delete Ethical Document
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No companies found for the selected semester.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyProfessorList;
