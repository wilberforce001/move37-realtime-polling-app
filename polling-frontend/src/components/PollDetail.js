import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams grabs route params (id from /poll/:id).
import axios from "axios"; // axios is used to make HTTP requests to the backend API
import { io } from "socket.io-client"; // socket.io-client for real-time WebSocket communication

const API_URL = "http://localhost:4000/api";
const socket = io("http://localhost:4000"); // A webSocket connection is opened to the backened server

function PollDetail() {
    const { id } = useParams(); // id - the poll's unique ID from the URL
    const [poll, setPoll] = useState(null); // poll - stores poll details (questions + options)

    const fetchPoll = async () => {
        const res = await axios.get(`${API_URL}/polls/${id}`);
        setPoll(res.data);
    }

    useEffect(() => {
        // fetch poll details
        axios.get(`${API_URL}/polls/${id}`)
        .then(res => setPoll(res.data))
        .catch(err => console.error(err));

        // join websocket room
        socket.emit("joinPoll", parseInt(id));

        socket.on("pollUpdated", (data) => {
            if (data.pollId === parseInt(id)) {
                setPoll(prev => ({
                    ...prev,
                    options: prev.options.map(opt => 
                        opt.id === data.optionId ? { ...opt, votes: data.votes} : opt 
                    )
                }));
            }
        });

        // cleanup on unmount
        return () => {
            socket.off("pollUpdated");
        };
    }, [id]);

    const handleVote = async (optionId) => {
        try {
            await axios.post(`${API_URL}/polls/${id}/vote`, {
                // userId: 1,
                optionId
            });
            fetchPoll();
        } catch (err) {
            console.error(err);
        }
    };

    if (!poll) return <div>Loading poll...</div>;

    return (
        <div>
            <h2>{poll.question}</h2>
            <ul>
                {poll.options.map(opt => (
                    <li key={opt.id}>
                        {opt.text} - {opt.votes || 0} votes
                        <button onClick={() => handleVote(opt.id)}>Vote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PollDetail;