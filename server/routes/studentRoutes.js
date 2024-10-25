import express from 'express';
import Company from '../models/companiesModel.js'; // Adjust the path as needed

const router = express.Router();

// GET all professors
router.get('/', async (req, res) => {
  try {
    const professors = await Company.find({ role: 'professor' }); // Adjust filtering if needed
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch professors' });
  }
});

// UPDATE a professor by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProfessor = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfessor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    res.status(200).json(updatedProfessor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update professor' });
  }
});

// DELETE a professor by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfessor = await Company.findByIdAndDelete(req.params.id);
    if (!deletedProfessor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    res.status(200).json({ message: 'Professor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete professor' });
  }
});

export default router;
