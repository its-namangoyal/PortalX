import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyProfessorList = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    about: '',
    profileUrl: '', // Added profile image URL
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmPopup, setConfirmPopup] = useState({ visible: false, action: null });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api-v1/professors');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      showMessage('error', 'Failed to load companies.');
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
      profileUrl: company.profileUrl, // Load the image URL
    });
  };

  const handleDelete = async (id) => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.delete(`http://localhost:8800/api-v1/professors/${id}`);
          showMessage('success', 'Company deleted successfully!');
          fetchCompanies();
        } catch (err) {
          console.error('Error deleting company:', err);
          showMessage('error', 'Failed to delete company.');
        }
      },
    });
  };

  const handleUpdate = async () => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.put(`http://localhost:8800/api-v1/professors/${editingCompany}`, formData);
          setEditingCompany(null);
          showMessage('success', 'Company updated successfully!');
          fetchCompanies();
        } catch (err) {
          console.error('Error updating company:', err);
          showMessage('error', 'Failed to update company.');
        }
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 10000);
  };

  const handleConfirm = async () => {
    if (confirmPopup.action) await confirmPopup.action();
    setConfirmPopup({ visible: false, action: null });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Company List</h1>

      {message.text && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-md transition-transform transform ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
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
                onClick={() => setConfirmPopup({ visible: false, action: null })}
                className="btn btn-secondary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white shadow-md p-6 rounded-md flex items-center justify-between"
          >
            {editingCompany === company._id ? (
              <div className="flex flex-col space-y-4 w-full">
                {/* Edit form for company */}
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

                <label className="font-semibold">Profile Image URL</label>
                <input
                  type="text"
                  name="profileUrl"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  className="input-field"
                />

                <div className="flex space-x-4">
                  <button onClick={handleUpdate} className="btn btn-primary">
                    Update
                  </button>
                  <button onClick={() => setEditingCompany(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full items-center">
                <div className="text-lg font-medium">
                  <img src={company.profileUrl} alt={`${company.name} Logo`} className="w-16 h-16 rounded-full mb-4" />
                  <p><strong>Name:</strong> {company.name}</p>
                  <p><strong>Email:</strong> {company.email}</p>
                  <p><strong>Contact:</strong> {company.contact}</p>
                  <p><strong>Location:</strong> {company.location}</p>
                  <p><strong>About:</strong> {company.about}</p>
                  <h3 className="font-semibold mt-4">Projects:</h3>
                  {company.projectPosts && company.projectPosts.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {company.projectPosts.map((project) => (
                        <li key={project._id}>
                          <strong>Title:</strong> {project.projectTitle} <br />
                          <strong>Type:</strong> {project.projectType} <br />
                          <strong>Salary:</strong> {project.salary} <br />
                          <strong>Location:</strong> {project.location} <br />
                          <strong>Experience:</strong> {project.experience} years <br />
                          <strong>Details:</strong>
                          <ul>
                            {project.detail.map((d, index) => (
                              <li key={index}>
                                <strong>Description:</strong> {d.desc} <br />
                                <strong>Requirements:</strong> {d.requirements}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects available.</p>
                  )}
                </div>
                <div className="space-x-4">
                  <button onClick={() => handleEdit(company)} className="btn btn-primary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(company._id)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyProfessorList;
