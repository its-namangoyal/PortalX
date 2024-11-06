import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils';

const Notes = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [noteSemester, setNoteSemester] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchNotes(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const res = await apiRequest({
        url: '/companies',
        method: 'GET',
      });

      if (res.success) {
        setCompanies(res.data || []);
      } else {
        showMessage('error', 'Failed to load companies.');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      showMessage('error', 'Failed to load companies.');
    }
  };

  const fetchNotes = async (companyId) => {
    try {
      const res = await apiRequest({
        url: `/notes/${companyId}`,
        method: 'GET',
      });

      if (res.success) {
        setNotes(res.notes || []);
      } else {
        showMessage('error', 'Failed to load notes.');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      showMessage('error', 'Failed to load notes.');
    }
  };

  const handleAddNote = async () => {
    if (!noteContent || !noteSemester || !selectedCompanyId) {
      showMessage('error', 'Please enter all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiRequest({
        url: '/notes',
        method: 'POST',
        data: {
          company: selectedCompanyId,
          content: noteContent,
          semester: noteSemester,
        },
      });

      console.log('API Response after adding note:', res);

      if (res.success) {
        fetchNotes(selectedCompanyId);
        setNoteContent('');
        setNoteSemester('');
        showMessage('success', 'Note added successfully!');
      } else {
        showMessage('error', res.message || 'Failed to add note.');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      showMessage('error', 'Failed to add note.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  return (
    <div className="notes-page bg-gray-100 min-h-screen p-6 sm:p-8">
      {message.text && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-lg transition-all transform ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Notes Management</h2>

      {/* Company Selection Dropdown */}
      <div className="mb-6 max-w-md mx-auto">
        <label className="block text-lg font-semibold mb-2 text-gray-700">Select Company</label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-700"
        >
          <option value="">-- Select a Company --</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Flex Layout */}
      <div className="flex flex-col md:flex-row gap-8 justify-between">
        {/* Left side: New Note Form */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-md p-6 space-y-4">
          {selectedCompanyId && (
            <>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Note</h3>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Note Content</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700"
                  placeholder="Enter note content"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Semester</label>
                <select
                  value={noteSemester}
                  onChange={(e) => setNoteSemester(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700"
                >
                  <option value="">Select Semester</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Winter 2024">Winter 2024</option>
                </select>
              </div>

              <button
                onClick={handleAddNote}
                className="w-full bg-blue-500 text-white font-semibold p-3 rounded-md mt-4 hover:bg-blue-600 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Save Note'}
              </button>
            </>
          )}
        </div>

        {/* Right side: Notes List */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-md p-6 space-y-4">
          {selectedCompanyId && (
            <>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Notes for Selected Company</h3>
              <ul className="space-y-3">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <li key={note._id} className="p-4 border-b border-gray-200 rounded-md">
                      <p className="text-gray-800">
                        <strong>{note.semester}:</strong> {note.content}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No notes available for this company.</p>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
