import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { io } from "socket.io-client";

function PollDetail() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        async function fetchPoll() {
            const res = await api.get(`/polls/${id}`);
            setPoll(res.data);
        }
        fetchPoll();

        // Connect socket
        const s = io("http://localhost:4000");
        s.emit("joinPoll", Number(id));

        s.on("pollUpdated", (data) => {
            if (data.pollId === Number(id)) {
                setPoll((prev) => ({
                    ...prev,
                    options: data.options,
                }));
            }
        });

        setSocket(s);
        return () => {
            s.emit("leavePoll", Number(id));
            s.disconnect();
        };
    }, [id]);

    const handleVote = async (optionId) => {
        await api.post(`/polls/${id}/vote`, {
            userId: 1,
            optionId,
        });
    };

    if (!poll) return <p>Loading...</p>;

    return (
        <div>
            <h2>{poll.question}</h2>
            <ul>
                {poll.options.map((opt) => {
                    <li key={opt.id}>
                        {opt.text} - {opt.votes} votes
                        <button onClick={() => handleVote(opt.id)}>handleVote</button>
                    </li>
                })}
            </ul>
        </div>
    );
}

export default PollDetail;