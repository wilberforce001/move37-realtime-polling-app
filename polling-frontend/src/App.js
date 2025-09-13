import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Polls</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/polls/:id" element={<PollDetail />} />
      </Routes>
    </Router>
  );
}

export default App; 