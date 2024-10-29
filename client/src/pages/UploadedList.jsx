import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadedList = () => {
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingProfessor, setEditingProfessor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentID: '',
    semester: ''
  });
  const [professorData, setProfessorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    professorID: '',
    semester: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmPopup, setConfirmPopup] = useState({ visible: false, action: null });
  
  // New state to control which list is shown
  const [showingStudents, setShowingStudents] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchProfessors();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api-v1/uploadedlist/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      showMessage('error', 'Failed to load students.');
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api-v1/uploadedlist/professors');
      setProfessors(response.data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
      showMessage('error', 'Failed to load professors.');
    }
  };

  const handleDelete = (type, id) => {
    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.delete(`http://localhost:8800/api-v1/uploadedlist/${type}/${id}`);
          showMessage('success', `${type === 'students' ? 'Student' : 'Professor'} deleted successfully!`);
          fetchStudents();
          fetchProfessors();
        } catch (error) {
          console.error(`Failed to delete ${type.slice(0, -1)}:`, error);
          showMessage('error', `Failed to delete ${type.slice(0, -1)}.`);
        }
      },
    });
  };

  const handleUpdate = async (type) => {
    const id = type === 'student' ? editingStudent : editingProfessor;
    const updatedData = type === 'student' ? formData : professorData;

    setConfirmPopup({
      visible: true,
      action: async () => {
        try {
          await axios.put(`http://localhost:8800/api-v1/uploadedlist/${type}/${id}`, updatedData);
          showMessage('success', `${type === 'student' ? 'Student' : 'Professor'} updated successfully!`);
          fetchStudents();
          fetchProfessors();
          // Reset form data after successful update
          if (type === 'student') {
            setEditingStudent(null);
            setFormData({ firstName: '', lastName: '', email: '', studentID: '', semester: '' });
          } else {
            setEditingProfessor(null);
            setProfessorData({ firstName: '', lastName: '', email: '', professorID: '', semester: '' });
          }
        } catch (error) {
          console.error(`Failed to update ${type.slice(0, -1)}:`, error);
          showMessage('error', `Failed to update ${type.slice(0, -1)}.`);
        }
      },
    });
  };

  const handleChange = (e, type) => {
    const setUpdatedData = type === 'student' ? setFormData : setProfessorData;
    setUpdatedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      {message.text && (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {confirmPopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p>Are you sure you want to proceed?</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleConfirm} className="bg-red-500 text-white rounded px-4 py-2 mr-2">Yes</button>
              <button onClick={() => setConfirmPopup({ visible: false, action: null })} className="bg-gray-300 text-black rounded px-4 py-2">No</button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Uploaded List</h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowingStudents(true)}
          className={`px-4 py-2 rounded ${showingStudents ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
        >
          Students
        </button>
        <button
          onClick={() => setShowingStudents(false)}
          className={`px-4 py-2 rounded ${!showingStudents ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
        >
          Professors
        </button>
      </div>

      <div className="space-y-6 mt-4">
        {showingStudents ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Students</h2>
            {students.map((student) => (
              <div key={student._id} className="bg-white shadow-md p-6 rounded-md flex justify-between items-center">
                {editingStudent === student._id ? (
                  <div className="flex flex-col space-y-4 w-full">
                    {['studentID', 'firstName', 'lastName', 'email', 'semester'].map((field) => (
                      <div key={field}>
                        <label className="font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type="text"
                          name={field}
                          value={formData[field] || student[field]}
                          onChange={(e) => handleChange(e, 'student')}
                          className="input-field"
                          disabled={field === 'studentID'}
                        />
                      </div>
                    ))}
                    <div className="flex space-x-4">
                      <button onClick={() => handleUpdate('student')} className="btn btn-primary">Update</button>
                      <button onClick={() => setEditingStudent(null)} className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between w-full items-center">
                    <div className="text-lg font-medium">
                      <p><strong>Student ID:</strong> {student.studentID}</p>
                      <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                      <p><strong>Email:</strong> {student.email}</p>
                      <p><strong>Semester:</strong> {student.semester}</p>
                    </div>
                    <div className="space-x-4">
                      <button onClick={() => { setEditingStudent(student._id); setFormData(student); }} className="btn btn-primary">Edit</button>
                      <button onClick={() => handleDelete('students', student._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Professors</h2>
            {professors.map((professor) => (
              <div key={professor._id} className="bg-white shadow-md p-6 rounded-md flex justify-between items-center">
                {editingProfessor === professor._id ? (
                  <div className="flex flex-col space-y-4 w-full">
                    {['professorID', 'firstName', 'lastName', 'email', 'semester'].map((field) => (
                      <div key={field}>
                        <label className="font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type="text"
                          name={field}
                          value={professorData[field] || professor[field]}
                          onChange={(e) => handleChange(e, 'professor')}
                          className="input-field"
                          disabled={field === 'professorID'}
                        />
                      </div>
                    ))}
                    <div className="flex space-x-4">
                      <button onClick={() => handleUpdate('professor')} className="btn btn-primary">Update</button>
                      <button onClick={() => setEditingProfessor(null)} className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between w-full items-center">
                    <div className="text-lg font-medium">
                      <p><strong>Professor ID:</strong> {professor.professorID}</p>
                      <p><strong>Name:</strong> {professor.firstName} {professor.lastName}</p>
                      <p><strong>Email:</strong> {professor.email}</p>
                      <p><strong>Semester:</strong> {professor.semester}</p>
                    </div>
                    <div className="space-x-4">
                      <button onClick={() => { setEditingProfessor(professor._id); setProfessorData(professor); }} className="btn btn-primary">Edit</button>
                      <button onClick={() => handleDelete('professors', professor._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadedList;
