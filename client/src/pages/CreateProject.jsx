import React, { useState } from "react";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("FA");
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = { title, description, semester, year };

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Project created successfully!");
      } else {
        setMessage("Failed to create project.");
      }
    } catch (error) {
      setMessage("Error creating project.");
    }
  };

  return (
    <div className="create-project">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="FA">Fall</option>
          <option value="SU">Summer</option>
          <option value="WI">Winter</option>
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <button type="submit">Create Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateProject;