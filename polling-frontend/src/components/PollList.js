import React, { useEffect, useState } from "react";
import axios from "axios"; // axios is used to make HTTP requests to the backend API
import Logout from "./Logout";
import PollDetail from "./PollDetail";

const API_URL = "http://localhost:4000/api"; // API base URL for the backend. All requests will be made relative to this
                                              // (REST API requests go to /api/...)

function PollsList() {
    const [polls, setPolls] = useState([]); // useState enables the storage of state inside
                                            // the component (here it stores the list of polls).
                                            // polls - state variable, starts as an empty array
                                            // setPolls - function to update polls after fetching data


    const [loading, setLoading] = useState([true]);   
    const [selectedPollId, setSelectedPollId] = useState(null);
    
    const role = localStorage.getItem("role");  

    useEffect(() => { // useEffect runs side effects after render (here it fetches polls from the backend)
        
        const token = localStorage.getItem("token");
        if(!token) {
            console.error("No token found, please login first.");
            setLoading(false);
            return;
        }
        axios.get(`${API_URL}/polls`, {
            headers: { Authorization: `Bearer ${token}`},
        })
        .then((res) => {
            setPolls(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching polls:", err);
            setLoading(false);
        });
    }, []); // Runs once when the component mounts. ([] dependency array ensures it doesn't run again. 


        const handleDelete = async (pollId) => {
        if (!window.confirm("Are you sure you want to delete this poll?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/polls/${pollId}`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            setPolls(polls.filter((p) => p.id !== pollId)); // update UI
            alert("Poll deleted successfully!");
        } catch (err) {
            console.error("Error deleting poll:", err);
            alert("Failed to delete poll");
        }
        };

    if (loading) return <p>Loading polls...</p>;
  
    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Available Polls</h1>
            <Logout />
        </div>

        {/* Show Create Poll link only for Admins */}
        {role === "ADMIN" && (
            <div className="mb-3">
            <a href="/create" className="btn btn-primary">
                + Create New Poll
            </a>
            </div>
        )}

        {polls.length === 0 ? (
            <p>No polls available yet.</p>
        ) : (
            <ul className="list-group">
            {polls.map((poll) => (
                <li
                key={poll.id}
                className="list-group-item"
                style={{ cursor: "pointer" }}
                onClick={() =>
                    setSelectedPollId(selectedPollId === poll.id ? null : poll.id)
                } // Toggle open/close
                >
                <div className="d-flex justify-content-between align-items-center">
                    <span>{poll.question}</span>
                    {role === "ADMIN" && (
                    <button
                        onClick={(e) => {
                        e.stopPropagation(); // prevent toggle when deleting
                        handleDelete(poll.id);
                        }}
                        className="btn btn-sm btn-danger"
                    >
                        Delete
                    </button>
                    )}
                </div>

                {/* Expand PollDetail inline if this poll is selected */}
                {selectedPollId === poll.id && (
                    <div className="mt-3">
                    <PollDetail id={poll.id} />
                    </div>
                )}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default PollsList;