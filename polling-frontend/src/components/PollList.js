// Fetch polls and show links
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function PollList() {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        async function fetchPolls() {
            const res = await api.get("/polls"); 
            setPolls(res.data);
        }
        fetchPolls();
    }, []);

    return (
        <div>
            <h2>Available Polls</h2>
            <ul>
                {polls.map((poll) => (
                    <li key={poll.id}>
                        <Link to={`/polls/${poll.id}`}>{poll.question}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PollList;