import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/polls";

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // start with 2 empty options
  const [message, setMessage] = useState("");

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
      const response = await axios.post(API_URL, {
        question,
        options: filteredOptions
      });
      setMessage("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      console.log("Created Poll:", response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error creating poll");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Create a Poll</h2>
      {message && <p className="mb-2 text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Question */}
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Options */}
        {options.map((opt, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 border p-2 rounded"
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Add Option */}
        <button
          type="button"
          onClick={addOption}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          + Add Option
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;
