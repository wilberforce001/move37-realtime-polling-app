import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      const { token, user } = res.data;

      // ✅ Save token + user info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      // Redirect to polls page
      navigate("/polls");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* Register link */}
      <div className="text-center mt-3">
        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
