import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link from react-router-dom, used for client-side navigation between routes
import axios from "axios"; // axios is used to make HTTP requests to the backend API

const API_URL = "http://localhost:4000/api"; // API base URL for the backend. All requests will be made relative to this
                                              // (REST API requests go to /api/...)

function PollsList() {
    const [polls, setPolls] = useState([]); // useState enables the storage of state inside
                                            // the component (here it stores the list of polls).
                                            // polls - state variable, starts as an empty array
                                            // setPolls - function to update polls after fetching data


    const [loading, setLoading] = useState([true]);                                       
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

    if (loading) return <p>Loading polls...</p>;
    return (
        <div>
            <h1>Available Polls</h1>
            {polls.length === 0 ? (
                <p>No polls available yet.</p>
            ) : (
                <ul>
                    {polls.map((poll) => (
                        <li key={poll.id}>
                            <Link to={`/poll/${poll.id}`}>{poll.question}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PollsList;