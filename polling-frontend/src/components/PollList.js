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

    useEffect(() => { // useEffect runs side effects after render (here it fetches polls from the backend)
        axios.get(`${API_URL}/polls`)
        .then(res => setPolls(res.data))
        .catch(err => console.error(err));
    }, []); // Runs once when the component mounts. ([] dependency array ensures it doesn't run again. 

    return (
        <div>
            <h1>Available Polls</h1>
            <ul>
                {polls.map(poll => ( // Loops over the polls array with .map()
                    <li>
                        <Link to={`/poll/${poll.id}`}>{poll.question}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PollsList;