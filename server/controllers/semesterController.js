// controllers/semesterController.js

import Semester from '../models/semesterModel.js';

export const getSemesters = async (req, res) => {
  console.log('Fetching all semesters...'); // Log when fetching semesters

  try {
    const semesters = await Semester.find(); // Fetch all semesters from the database
    console.log('Semesters found:', semesters); // Log the fetched semesters
    res.status(200).json({ success: true, semesters }); // Send the semesters in the response
  } catch (error) {
    console.error('Error fetching semesters:', error); // Log any errors
    res.status(500).json({ message: 'Failed to fetch semesters', error: error.message }); // Send error response
  }
};
