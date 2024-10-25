import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [editingProfessor, setEditingProfessor] = useState(null);
  const [formData, setFormData] = useState({
    professorID: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmPopup, setConfirmPopup] = useState({ visible: false, action: null });

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api-v1/professors');
      setProfessors(response.data);
    } catch (err) {
      console.error('Error fetching professors:', err);
      showMessage('error', 'Failed to load professors.');
    }
  };

  const handleEdit = (professor) => {
    setEditingProfessor(professor._id);
    setFormData({
      professorID: professor.professorID,
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
    });
  };

  const handleDelete = async (id) => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.delete(`http://localhost:8800/api-v1/professors/${id}`);
          showMessage('error', 'Professor deleted successfully!');
          fetchProfessors();
        } catch (err) {
          console.error('Error deleting professor:', err);
          showMessage('error', 'Failed to delete professor.');
        }
      },
    });
  };

  const handleUpdate = async () => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.put(`http://localhost:8800/api-v1/professors/${editingProfessor}`, formData);
          setEditingProfessor(null);
          showMessage('success', 'Professor updated successfully!');
          fetchProfessors();
        } catch (err) {
          console.error('Error updating professor:', err);
          showMessage('error', 'Failed to update professor.');
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
      <h1 className="text-3xl font-bold text-center mb-6">Professor List</h1>

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
              <button
                onClick={handleConfirm}
                className="btn btn-primary"
              >
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
        {professors.map((professor) => (
          <div
            key={professor._id}
            className="bg-white shadow-md p-6 rounded-md flex items-center justify-between"
          >
            {editingProfessor === professor._id ? (
              <div className="flex flex-col space-y-4 w-full">
                <label className="font-semibold">Professor ID</label>
                <input
                  type="text"
                  name="professorID"
                  value={formData.professorID}
                  disabled
                  className="input-field bg-gray-200 cursor-not-allowed"
                />

                <label className="font-semibold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                />

                <label className="font-semibold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingProfessor(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full items-center">
                <div className="text-lg font-medium">
                  <p>
                    <strong>Name:</strong> {professor.firstName} {professor.lastName}
                  </p>
                  <p>
                    <strong>Professor ID:</strong> {professor.professorID}
                  </p>
                  <p>
                    <strong>Email:</strong> {professor.email}
                  </p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => handleEdit(professor)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(professor._id)}
                    className="btn btn-danger"
                  >
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
