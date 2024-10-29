import express from 'express';
import Student from '../models/studentsModel.js'; // Adjust the path as needed
import Professor from '../models/professorModel.js'; // Adjust the path as needed

const router = express.Router();

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET all professors
router.get('/professors', async (req, res) => {
  try {
    const professors = await Professor.find();
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch professors' });
  }
});

// UPDATE a student by ID
router.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE a student by ID
router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// UPDATE a professor by ID
router.put('/professors/:id', async (req, res) => {
  try {
    const updatedProfessor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProfessor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update professor' });
  }
});

// DELETE a professor by ID
router.delete('/professors/:id', async (req, res) => {
  try {
    await Professor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Professor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete professor' });
  }
});

export default router;
