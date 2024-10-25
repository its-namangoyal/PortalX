import express from 'express';
import Companies from '../models/companiesModel.js'; // Ensure correct path
import Projects from '../models/projectsModel.js'; // Ensure correct path for projects

const router = express.Router();

// Get all companies with populated projects
router.get('/', async (req, res) => {
  try {
    const companies = await Companies.find().populate('projectPosts'); // Populate projectPosts
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to load companies.' });
  }
});

// Get a single company by ID with populated projects
router.get('/:id', async (req, res) => {
  try {
    const company = await Companies.findById(req.params.id).populate('projectPosts'); // Populate projectPosts
    if (!company) return res.status(404).json({ message: 'Company not found.' });

    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Failed to load company.' });
  }
});

// Create a new company
router.post('/', async (req, res) => {
  try {
    const newCompany = new Companies(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ message: 'Failed to create company.' });
  }
});

// Update an existing company
router.put('/:id', async (req, res) => {
  try {
    const updatedCompany = await Companies.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) return res.status(404).json({ message: 'Company not found.' });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(400).json({ message: 'Failed to update company.' });
  }
});

// Delete a company
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await Companies.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ message: 'Company not found.' });

    res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Failed to delete company.' });
  }
});

export default router;
