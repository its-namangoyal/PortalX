import Notes from '../models/notesModel.js';
import Companies from '../models/companiesModel.js'; // Ensure this import path is correct

// Create a new note
export const createNote = async (req, res) => {
  const { company, content, semester } = req.body;

  try {
    if (!company || !content || !semester) {
      return res.status(400).json({ success: false, message: 'Missing required fields: company, content, semester' });
    }

    const newNote = new Notes({
      company,
      content,
      semester,
    });

    const savedNote = await newNote.save();
    
    // Send a success response with the saved note
    return res.status(201).json({
      success: true,
      data: savedNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message,
    });
  }
};


export const getNotesByCompany = async (req, res) => {
  const { companyId } = req.params;
  console.log('Company ID received:', companyId); // Log the companyId

  try {
    const notes = await Notes.find({ company: companyId }).populate('company', 'name');
    console.log('Notes found:', notes); // Log the notes found
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error); // Log any errors
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};


// Update a note
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { content, semester } = req.body;

  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      { content, semester },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const deletedNote = await Notes.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
};
