import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import Login from "./components/Login";
import CreatePoll from "./components/createPoll";

function App() {
  const role = localStorage.getItem("role");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
          {role === "ADMIN" && <Route path="/create" element={<CreatePoll />} />}
        <Route path="/polls" element={<PollList />} ></Route>
        <Route path="/poll/:id" element={<PollDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 