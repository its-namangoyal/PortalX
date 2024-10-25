import express from 'express';
import Professor from '../models/professorModel.js';

const router = express.Router();

// Get all professors
router.get('/', async (req, res) => {
  try {
    const professors = await Professor.find();
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching professors' });
  }
});

// Get a professor by ID
router.get('/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor) {
      res.status(200).json(professor);
    } else {
      res.status(404).json({ message: 'Professor not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching professor' });
  }
});

// Create a new professor
router.post('/', async (req, res) => {
  const { professorID, firstName, lastName, email } = req.body;
  const newProfessor = new Professor({ professorID, firstName, lastName, email });

  try {
    await newProfessor.save();
    res.status(201).json(newProfessor);
  } catch (err) {
    res.status(400).json({ message: 'Error creating professor' });
  }
});

// Update a professor
router.put('/:id', async (req, res) => {
  try {
    const updatedProfessor = await Professor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProfessor) {
      res.status(200).json(updatedProfessor);
    } else {
      res.status(404).json({ message: 'Professor not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating professor' });
  }
});

// Delete a professor
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfessor = await Professor.findByIdAndDelete(req.params.id);
    if (deletedProfessor) {
      res.status(200).json({ message: 'Professor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Professor not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting professor' });
  }
});

export default router;
