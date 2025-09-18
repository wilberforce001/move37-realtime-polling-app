import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import CreatePoll from "./components/createPoll";
import 'bootstrap/dist/css/bootstrap.min.css';

function PollDetailWrapper() {
  const { id } = useParams();
  return <PollDetail id={id} />
}

function App() {
  const role = localStorage.getItem("role");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
          {role === "ADMIN" && <Route path="/create" element={<CreatePoll />} />}
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<PollList />} ></Route>
        {/* <Route path="/poll/:id" element={<PollDetail />} /> */}
        <Route path="/polls/:id" element={<PollDetailWrapper />} />
      </Routes>
    </Router>
  );
}

export default App; 