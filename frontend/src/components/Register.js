import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("SERVER ERROR:", err.response?.data)
      alert(err.response?.data?.error || "Failed to register");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>

      {/* Login link */}
      <div className="text-center mt-3">
        <p>
          Already have an account?{" "}
          <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;


// postgresql://polling_db_kzqw_user:nM4loJTAtICcf1cAmtD5jwiDwfE2orcI@dpg-d37728umcj7s73fenrsg-a/polling_db_kzqw; 
// postgresql://health_claims_fraud_user:AOMDiwvjvCwIhRLsAn9XKfwUm1uZ57pG@dpg-d6mbs5tactks73fvn0ng-a/health_claims_fraud