import express from 'express';
import { createNote, getNotesByCompany, updateNote, deleteNote } from '../controllers/notesController.js';

const router = express.Router();

// Create a new note
router.post('/', createNote);

// Get notes by company ID
router.get('/:companyId', getNotesByCompany);

// Update a note by ID
router.put('/:noteId', updateNote);

// Delete a note by ID
router.delete('/:noteId', deleteNote);

export default router;
