import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../utils';

const ProfessorNotes = () => {
  const { id } = useParams(); // Capture 'id' from URL params
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', semester: '' });

  useEffect(() => {
    if (id) {
      fetchCompanyNotes(id);
    }
  }, [id]);

  const fetchCompanyNotes = async (id) => {
    setIsLoading(true);
    try {
      const res = await apiRequest({
        url: `/notes/${id}`, // Use the captured 'id' from the URL
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
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleNoteChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!newNote.content || !newNote.semester) {
      showMessage('error', 'Content and Semester are required!');
      return;
    }

    try {
      const res = await apiRequest({
        url: '/notes',
        method: 'POST',
        data: {
          company: id,
          content: newNote.content,
          semester: newNote.semester,
        },
      });

      if (res.success) {
        showMessage('success', 'Note added successfully!');
        setNotes([res.data, ...notes]); // Add the new note to the top of the list
        setNewNote({ content: '', semester: '' }); // Clear the form
      } else {
        showMessage('error', 'Failed to add note.');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      showMessage('error', 'Failed to add note.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    // Optimistic UI update: immediately remove the note
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

    try {
      const res = await apiRequest({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      });

      if (res.success) {
        // Successfully deleted, show success message
        showMessage('success', 'Note deleted successfully!');
      } else {
        // If something goes wrong, we need to refresh the state and show the failure message
        showMessage('error', 'Failed to delete note.');
        fetchCompanyNotes(id); // Re-fetch notes from the server in case the delete failed
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      showMessage('error', 'Failed to delete note.');
      fetchCompanyNotes(id); // Re-fetch notes in case of failure
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats to 'MM/DD/YYYY'
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

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Professor Notes</h2>

      <div className="flex space-x-8">
        {/* Left: Add New Note Form */}
        <div className="w-1/2 bg-white shadow-md rounded-md p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Note</h3>
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label htmlFor="semester" className="block text-gray-700">Semester</label>
              <select
                id="semester"
                name="semester"
                value={newNote.semester}
                onChange={handleNoteChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a semester</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Summer 2024">Summer 2024</option>
                <option value="Winter 2024">Winter 2024</option>
                <option value="Spring 2024">Spring 2024</option>
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-gray-700">Content</label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleNoteChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Enter note content"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Right: Available Notes */}
        <div className="w-1/2 bg-white shadow-md rounded-md p-6 space-y-4">
          {isLoading ? (
            <p>Loading notes...</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Notes for Selected Company</h3>
              <ul className="space-y-3">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <li key={note._id} className="p-4 border-b border-gray-200 rounded-md">
                      <div className="flex justify-between">
                        <p className="text-gray-800">
                          <strong>{note.semester}:</strong> {note.content}
                        </p>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">
                        <strong>Created on:</strong> {formatDate(note.createdAt)}
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

export default ProfessorNotes;
