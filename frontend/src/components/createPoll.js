import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // start with 2 empty options
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredOptions = options.filter(opt => opt.trim() !== "");
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Not logged in!");
        return;
      }

      const response = await axios.post(
        `${API_URL}/polls`,
        { question, options: filteredOptions },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      console.log("Created Poll:", response.data);

      // redirect straight to new poll page
      navigate("/polls");

    } catch (error) {
      console.error(error);
      setMessage("Error creating poll");
      alert("Failed to create poll. Check console for details.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Create a Poll</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control"
            required
          />
        </div>

        {options.map((opt, idx) => (
          <div key={idx} className="input-group mb-2">
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="form-control"
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="btn btn-outline-danger"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="btn btn-secondary mb-3"
        >
          + Add Option
        </button>
        <br />
        <button type="submit" className="btn btn-primary w-100">
          Create Poll
        </button>
      </form>
    </div>

  );
}

export default CreatePoll;
