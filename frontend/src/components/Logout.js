import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/")
    };

    return (
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
            Logout
        </button>
    );
}

export default Logout;