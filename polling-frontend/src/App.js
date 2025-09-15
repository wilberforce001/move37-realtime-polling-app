import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/polls" element={<PollList />} ></Route>
        <Route path="/polls/:id" element={<PollDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 