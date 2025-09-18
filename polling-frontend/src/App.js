import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import CreatePoll from "./components/createPoll";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditPoll from "./components/EditPoll";

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
        <Route path="/login" element={<Login />}/>
          {role === "ADMIN" && <Route path="/create" element={<CreatePoll />} />}
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<PollList />} ></Route>
        <Route path="/polls/:id" element={<PollDetailWrapper />} />
        <Route path="/edit/:id" element={<EditPoll />} />
      </Routes>
    </Router>
  );
}

export default App; 