import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function EditPoll() {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/polls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestion(res.data.question || "");
        setOptions(
          (res.data.options || []).map((o) => ({
            id: o.id,
            text: o.text || "",
          }))
        );
        setIsPublished(res.data.isPublished || false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
    await axios.put(
      `${API_URL}/polls/${id}`,
      {
        question,
        options: options
          .filter((o) => o.text.trim() !== "")
          .map((o) => ({
            id: o.id || undefined, // keep id for existing, undefined for new
            text: o.text,
          })),
        isPublished,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

      alert("Poll updated successfully!");
      navigate("/polls");
    } catch (err) {
      console.error("Error updating poll:", err);
      alert("Failed to update poll");
    }
  };

  const addOption = () => {
    setOptions([...options, { id: null, text: "" }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert("Poll must have at least 2 options.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Edit Poll</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {options.map((opt, i) => (
          <div className="input-group mb-3" key={opt.id || i}>
            <input
              type="text"
              className="form-control"
              placeholder={`Option ${i + 1}`}
              value={opt.text || ""} // ensure controlled input
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = { ...opt, text: e.target.value };
                setOptions(newOptions);
              }}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeOption(i)}
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

        <div className="mb-3">
          <label className="form-label me-2">Published</label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update Poll
        </button>
      </form>
    </div>
  );
}

export default EditPoll;
