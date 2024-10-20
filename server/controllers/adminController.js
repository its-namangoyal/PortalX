// controllers/adminController.js
import XLSX from 'xlsx';
import fs from 'fs';
import Student from '../models/studentsModel.js'; // Assuming you have a Student model

export const uploadStudentFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read the uploaded file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert data into MongoDB
    await Student.insertMany(data);

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Student data uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading student data.' });
  }
};
