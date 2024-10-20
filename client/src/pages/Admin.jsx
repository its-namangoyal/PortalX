import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("studentFile", file);

    try {
      const response = await axios.post("http://localhost:8800/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "File uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div>
      <h2>Admin Panel: Upload Student Data</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
