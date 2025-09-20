import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
const SOCKET_URL = API_URL.replace("/api", "");

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

function PollDetail({ id }) {
  const [poll, setPoll] = useState(null);

  const fetchPoll = async () => {
    const res = await axios.get(`${API_URL}/polls/${id}`);
    setPoll(res.data);
  };

  useEffect(() => {
    fetchPoll();

    socket.emit("joinPoll", parseInt(id));

    socket.on("pollUpdated", (data) => {
      if (data.pollId === parseInt(id)) {
        setPoll((prev) => ({
          ...prev,
          options: data.options,
        }));
      }
    });

    return () => {
      socket.off("pollUpdated");
    };
  }, [id]);

  const handleVote = async (optionId) => {
    try {
      await axios.post(`${API_URL}/polls/${id}/vote`, { optionId });
      fetchPoll();
    } catch (err) {
      console.error(err);
    }
  };

  if (!poll) return <div>Loading poll...</div>;

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>{poll.question}</h5>
        <ul className="list-group">
          {poll.options.map((opt) => (
            <li
              key={opt.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {opt.text}
              <div>
                <span className="badge bg-primary me-2">{opt.votes || 0} votes</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(opt.id);
                  }}   
                  className="btn btn-sm btn-success"
                >
                  Vote
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PollDetail;
