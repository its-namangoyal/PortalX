import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentID: '',
    semester: '',
    contact: '',
    location: '',
    projectTitle: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmPopup, setConfirmPopup] = useState({ visible: false, action: null });
  const [selectedSemester, setSelectedSemester] = useState("All");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api-v1/students');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      showMessage('error', 'Failed to load users.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      studentID: user.studentID,
      semester: user.semester,
      contact: user.contact,
      location: user.location,
      projectTitle: user.projectTitle,
    });
  };

  const handleDelete = async (id) => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.delete(`http://localhost:8800/api-v1/students/${id}`);
          showMessage('success', 'User deleted successfully!');
          fetchUsers();
        } catch (err) {
          console.error('Error deleting user:', err);
          showMessage('error', 'Failed to delete user.');
        }
      },
    });
  };

  const handleUpdate = async () => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.put(`http://localhost:8800/api-v1/students/${editingUser}`, formData);
          setEditingUser(null);
          showMessage('success', 'User updated successfully!');
          fetchUsers();
        } catch (err) {
          console.error('Error updating user:', err);
          showMessage('error', 'Failed to update user.');
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

  // Filter users based on the selected semester
  const filteredUsers = selectedSemester === "All"
    ? users
    : users.filter(user => user.semester === selectedSemester);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {message.text && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
              <button onClick={() => setConfirmPopup({ visible: false, action: null })} className="btn btn-secondary">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-5">
        {["All", "Summer 2024", "Fall 2024", "Winter 2024"].map((semester) => (
          <button
            key={semester}
            className={`px-4 py-2 rounded-md ${
              selectedSemester === semester ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedSemester(semester)}
          >
            {semester}
          </button>
        ))}
      </div>

      <div className="space-y-6 mt-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-white shadow-md p-6 rounded-md flex items-center justify-between">
              {editingUser === user._id ? (
                <div className="flex flex-col space-y-4 w-full">
                  <div>
                    <label className="font-semibold">Student ID</label>
                    <input
                      type="text"
                      name="studentID"
                      value={formData.studentID}
                      onChange={handleChange}
                      className="input-field"
                      disabled
                    />
                  </div>
                  {['firstName', 'lastName', 'email', 'semester', 'contact', 'location', 'projectTitle'].map((field) => (
                    <div key={field}>
                      <label className="font-semibold">{field}</label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-4">
                    <button onClick={handleUpdate} className="btn btn-primary">
                      Update
                    </button>
                    <button onClick={() => setEditingUser(null)} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full items-center">
                  <div className="text-lg font-medium">
                    {user.profileUrl && (
                      <img src={user.profileUrl} alt="Profile" className="w-20 h-20 rounded-full" />
                    )}
                    <p><strong>Student ID:</strong> {user.studentID}</p>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Semester:</strong> {user.semester}</p>
                    <p><strong>Contact:</strong> {user.contact}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                    <p><strong>Project Title:</strong> {user.projectTitle}</p>
                    {user.cvUrl && (
                      <a
                        href={user.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        Resume
                      </a>
                    )}
                  </div>
                  <div className="space-x-4">
                    <button onClick={() => handleEdit(user)} className="btn btn-primary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">No students found for the selected semester.</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
