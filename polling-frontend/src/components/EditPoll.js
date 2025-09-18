import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

function EditPoll() {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/polls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestion(res.data.question);
        setOptions(res.data.options.map((o) => o.text));
        setIsPublished(res.data.isPublished);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${API_URL}/polls/${id}`,
        { question, options, isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Poll updated successfully!");
      navigate("/polls");
    } catch (err) {
      console.error("Error updating poll:", err);
      alert("Failed to update poll");
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
          <div className="mb-3" key={i}>
            <label className="form-label">Option {i + 1}</label>
            <input
              type="text"
              className="form-control"
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              required
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Published</label>
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
